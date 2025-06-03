import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, RotateCcw, Download, MoreVertical } from 'lucide-react';
import {className} from "postcss-selector-parser";

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "안녕하세요! MODIVE AI 어시스턴트입니다. 운적 관리, 회원 정보 조회, 데이터 분석 등 다양한 업무를 도와드릴 수 있습니다. 무엇을 도와드릴까요?",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const simulateTyping = () => {
        setIsTyping(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                setIsTyping(false);
                resolve();
            }, 800 + Math.random() * 1500);
        });
    };

    const generateAIResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('운적') || lowerMessage.includes('포인트')) {
            return "운적 관리 관련 문의시군요. 현재 시스템에서 운적 점수 조회, 적립 내역 확인, 등급별 혜택 안내 등을 도와드릴 수 있습니다. 구체적으로 어떤 부분이 궁금하신가요?";
        }

        if (lowerMessage.includes('회원') || lowerMessage.includes('고객')) {
            return "회원 관리 기능을 안내해드리겠습니다. 회원 정보 조회, 등급 변경, 활동 내역 분석 등이 가능합니다. 특정 회원 ID나 이메일을 알려주시면 더 자세한 정보를 제공해드릴 수 있습니다.";
        }

        if (lowerMessage.includes('분석') || lowerMessage.includes('통계') || lowerMessage.includes('데이터')) {
            return "데이터 분석 서비스를 제공해드리겠습니다. 현재 가능한 분석: 회원 활동 통계, 운적 적립 패턴, 등급별 분포도, 월별 트렌드 등이 있습니다. 어떤 분석이 필요하신지 구체적으로 말씀해주세요.";
        }

        if (lowerMessage.includes('도움') || lowerMessage.includes('기능')) {
            return `MODIVE AI 어시스턴트의 주요 기능을 안내해드리겠습니다:

                    📊 **데이터 분석**: 회원 통계, 운적 패턴 분석
                    👥 **회원 관리**: 정보 조회, 등급 관리, 활동 추적  
                    🎯 **운적 시스템**: 포인트 조회, 적립 내역, 등급 혜택
                    📈 **리포트 생성**: 맞춤형 보고서 작성
                    🔍 **검색 기능**: 통합 데이터 검색
                    
                    구체적인 업무나 질문이 있으시면 언제든 말씀해주세요!`;
        }

        if (lowerMessage.includes('안녕') || lowerMessage.includes('hello')) {
            return "안녕하세요! 반갑습니다. MODIVE 시스템과 관련하여 궁금한 점이나 도움이 필요한 업무가 있으시면 언제든 말씀해주세요.";
        }

        const responses = [
            "네, 말씀하신 내용을 확인했습니다. 더 구체적인 정보를 알려주시면 정확한 도움을 드릴 수 있습니다.",
            "MODIVE 시스템에서 해당 기능을 찾아보겠습니다. 잠시만 기다려주세요.",
            "좋은 질문이네요! 관련 데이터를 분석해서 최적의 답변을 준비해드리겠습니다.",
            "해당 요청사항을 처리하겠습니다. 추가로 필요한 정보가 있다면 알려주세요.",
            "MODIVE AI가 분석한 결과를 바탕으로 답변드리겠습니다. 구체적인 조건이나 필터가 있으시면 말씀해주세요."
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue('');

        await simulateTyping();

        const aiMessage = {
            id: messages.length + 2,
            text: generateAIResponse(currentInput),
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiMessage]);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: 1,
                text: "채팅이 초기화되었습니다. 새로운 질문을 해주세요!",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    };

    const handleExportChat = () => {
        const chatData = messages.map(msg =>
            `[${msg.timestamp}] ${msg.sender === 'ai' ? 'AI' : '사용자'}: ${msg.text}`
        ).join('\n');

        const blob = new Blob([chatData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MODIVE_AI_Chat_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const quickActions = [
        '회원 통계 보기',
        '운적 현황 분석',
        '이번 달 데이터 요약',
        '등급별 회원 분포',
        '최근 활동 내역'
    ];

    return (
        <div className="w-[600px] h-[1000px] bg-gray-50 flex flex-col mx-auto">
            {/* 상단 헤더 */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">MODIVE AI</h1>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-gray-500">온라인</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleClearChat}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            title="채팅 초기화"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleExportChat}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            title="채팅 내보내기"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-white">
                {/* 퀵 액션 버튼들 */}
                {messages.length <= 1 && (
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">빠른 실행</h3>
                        <div className="flex flex-wrap gap-2">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => setInputValue(action)}
                                    className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start gap-2 ${
                                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                            }`}
                        >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.sender === 'user'
                                    ? 'bg-gray-300'
                                    : 'bg-blue-500'
                            }`}>
                                {message.sender === 'user' ? (
                                    <User className="w-4 h-4 text-gray-600" />
                                ) : (
                                    <Bot className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div className={`max-w-xs ${
                                message.sender === 'user' ? 'text-right' : 'text-left'
                            }`}>
                                <div className={`inline-block p-3 rounded-lg whitespace-pre-line ${
                                    message.sender === 'user'
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'bg-blue-50 text-gray-900 border border-blue-100'
                                }`}>
                                    <p className="text-sm leading-relaxed">{message.text}</p>
                                </div>
                                <p className={`text-xs text-gray-500 mt-1 ${
                                    message.sender === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                    {message.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-start gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 입력 영역 */}
                <div className="border-t border-gray-200 p-3 flex-shrink-0">
                    <div className="flex gap-2">
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="MODIVE AI에게 질문하거나 업무를 요청하세요..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                rows="2"
                maxLength={1000}
            />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>Enter로 전송</span>
                        <span className={inputValue.length > 800 ? 'text-red-500' : ''}>{inputValue.length}/1000</span>
                    </div>
                </div>
            </div>

            {/* 하단 정보 */}
            <div className="p-2 text-center text-xs text-gray-500 bg-gray-50 flex-shrink-0">
                <p>MODIVE AI 어시스턴트 v1.0</p>
            </div>
        </div>
    )
}

export default Chatbot;