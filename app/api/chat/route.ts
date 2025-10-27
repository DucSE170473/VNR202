import { NextRequest, NextResponse } from 'next/server'
import { generateContent, GeminiMessage } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // System prompt cho AI về Lịch sử Đảng
    const systemPrompt = `Bạn là một AI hỗ trợ học tập chuyên về môn Lịch sử Đảng Cộng sản Việt Nam. Nhiệm vụ của bạn:

1. Trả lời các câu hỏi về lịch sử Đảng Cộng sản Việt Nam một cách chính xác và có căn cứ
2. Giải thích các sự kiện, cột mốc lịch sử một cách dễ hiểu
3. Hỗ trợ sinh viên ôn tập và chuẩn bị thi
4. Luôn trả lời bằng tiếng Việt
5. Nếu không chắc chắn về câu trả lời, hãy đề xuất sinh viên hỏi giáo viên

Các chủ đề chính bạn có thể hỗ trợ:
- Hoàn cảnh ra đời và vai trò lãnh đạo của Đảng
- Đường lối kháng chiến chống thực dân Pháp và đế quốc Mỹ
- Công cuộc đổi mới đất nước từ năm 1986
- Quá trình xây dựng và phát triển đất nước thời kỳ quá độ lên CNXH
- Đường lối đối ngoại và hội nhập quốc tế
- Bài học kinh nghiệm về sự lãnh đạo của Đảng

Hãy trả lời một cách nhiệt tình, chính xác và hữu ích.`

    // Tạo messages cho Gemini API
    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nCâu hỏi của sinh viên: ${message}` }]
      }
    ]

    console.log('Generating response for message:', message)
    const response = await generateContent(messages)
    console.log('Generated response:', response?.substring(0, 100))

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xử lý câu hỏi'
    
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    )
  }
}
