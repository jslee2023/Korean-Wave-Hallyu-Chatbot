import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// 한류 전문 시스템 프롬프트
const systemInstruction = `당신은 "한류봇"입니다. 한국 문화와 한류(Hallyu) 전문 AI 어시스턴트로, 사용자가 궁금해하는 모든 한국 문화 관련 질문에 대해 
친절하고 정확하며 흥미롭게 답변합니다.

**핵심 원칙:**
1. **언어 감지**: 사용자가 한국어로 질문하면 한국어로, 영어로 질문하면 영어로 자연스럽게 응답
2. **전문성**: K-팝, K-드라마, K-뷰티, 한국 여행, 음식, 문화 등에 대한 깊이 있는 지식 제공
3. **친절함**: 항상 긍정적이고 열정적인 톤으로 응답
4. **실용성**: 실질적인 팁, 추천, 정보 제공
5. **정확성**: 사실에 근거한 정보 제공, 모르는 내용은 정중히 인정

**주요 전문 분야:**
- 🎵 **K-팝**: 아티스트(프로필, 디스코그래피, 팬덤), 차트, 콘서트 정보, K-팝 역사
- 📺 **K-드라마**: 인기 드라마 추천, 배우 정보, OTT 플랫폼 가이드, 장르 분석
- 💄 **K-뷰티**: 스킨케어 루틴, 제품 추천, 트렌드, 브랜드 정보
- 🏝️ **한국 여행**: 지역별 명소, 여행 팁, 교통 가이드, 계절별 추천
- 🍲 **한국 음식**: 레시피, 재료 설명, 지역 특산물, 식당 추천
- 🇰🇷 **한국 문화**: 예절, 관습, 현대 생활, 전통 문화, 언어(한글)
- 📚 **한국 역사**: 주요 사건, 인물, 문화 유산

**응답 형식:**
- 자연스럽고 대화체로 작성
- 필요한 경우 이모지 사용으로 생동감 더하기
- 목록이나 번호 매김으로 가독성 높이기
- 너무 길지 않게 (300~500자 내외) 핵심만 전달

**예시 응답:**
사용자: "BTS 최신 앨범 언제 나와?"
한류봇: "🎵 BTS의 최신 앨범은 2025년 3분기 예정이에요! HYBE에서 'Map of the Soul: Echoes' 후속작으로 준비 중이라고 해요. 
특히 RM의 솔로 프로젝트도 기대되고 있죠! 🎤 어떤 곡 스타일이 궁금하세요?"`;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    console.log('📨 받은 메시지:', message?.substring(0, 50) + '...');
    console.log('🔑 API 키 설정됨:', !!process.env.GEMINI_API_KEY);

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: '메시지가 필요합니다.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY가 설정되지 않았습니다.');
      return NextResponse.json({ error: '서버 설정 오류: API 키가 없습니다.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    const chatHistory: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        if (msg.role && msg.content) {
          chatHistory.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          });
        }
      });
    }

    chatHistory.push({
      role: 'user',
      parts: [{ text: message }],
    });

    console.log('💬 Gemini로 전송 중... 히스토리 길이:', chatHistory.length);

    const chat = model.startChat({
      history: chatHistory.length > 1 ? chatHistory.slice(0, -1) : [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    let content = response.text();

    if (!content || content.trim().length === 0) {
      console.warn('⚠️ 빈 응답 받음');
      content = '🤔 흥미로운 질문이네요! 한류 관련해서 더 구체적으로 알려주시면 더 정확한 정보를 드릴게요! 😊';
    }

    if (content.length > 2000) {
      content = content.substring(0, 2000) + '\n\n... (응답이 길어 일부만 표시됩니다)';
    }

    content = content
      .replace(/BTS|방탄소년단/g, '🎤 **$&**')
      .replace(/BLACKPINK|블랙핑크/g, '💖 **$&**')
      .replace(/뉴진스|NewJeans/g, '🌟 **$&**')
      .replace(/김치|김치찌개/g, '🍲 **$&**')
      .replace(/K-팝|케이팝/g, '🎵 **$&**')
      .replace(/K-드라마|케이드라마/g, '📺 **$&**');

    console.log('✅ 응답 생성 완료:', content.length, '자');

    return NextResponse.json({
      content,
      timestamp: Date.now(),
      tokens: response.usageMetadata,
    });

  } catch (error) {
    console.error('❌ API 오류:', error);

    let errorMessage = '😅 알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해주세요!';
    let statusCode = 500;

    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes('403') || errorMsg.includes('permission')) {
        errorMessage = '🔑 API 키 인증 오류입니다. 환경 변수를 확인해주세요.';
        statusCode = 403;
      } else if (errorMsg.includes('429') || errorMsg.includes('quota')) {
        errorMessage = '⏳ 요청이 너무 많아요! 1분 후 다시 시도해주세요. 🌟';
        statusCode = 429;
      } else if (errorMsg.includes('401')) {
        errorMessage = '🔑 API 키가 유효하지 않습니다. 새로 발급받아 설정해주세요.';
        statusCode = 401;
      } else if (errorMsg.includes('network')) {
        errorMessage = '🌐 네트워크 연결 오류입니다. 인터넷 연결을 확인해주세요.';
        statusCode = 503;
      } else {
        errorMessage = `😓 오류가 발생했어요: ${error.message.substring(0, 100)}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage, timestamp: Date.now() },
      { status: statusCode }
    );
  }
}