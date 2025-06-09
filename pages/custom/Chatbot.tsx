import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, RotateCcw, Download, MoreVertical } from 'lucide-react';
import {className} from "postcss-selector-parser";

type ChatbotProps = {
    setComponents: (any) => void;
}

const Chatbot = (chatbotProps: ChatbotProps) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "안녕하세요! MODIVE AI 어시스턴트입니다. 회원 정보 조회, 데이터 분석 등 다양한 업무를 도와드릴 수 있습니다. 무엇을 도와드릴까요?",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const [apiResponse, setApiResponse] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const agentRequest = async () => {
        setIsTyping(true);

        // 응답 데이터를 저장할 로컬 변수
        let responseText = 'Agent 호출에 실패했습니다. 다시 시도해주세요.';

        try {
            let sessionId = sessionStorage.getItem("session_id");

            if (sessionId === null) {
                console.log("새 세션 생성 중...");
                const newSessionResponse = await fetch('http://localhost:8000/agent/new', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "userId": "userId"
                    })
                });

                if (!newSessionResponse.ok) {
                    throw new Error('새 세션 생성 실패');
                }

                const newSessionData = await newSessionResponse.json();
                console.log("새 세션 데이터:", newSessionData);

                sessionId = newSessionData.data;
                sessionStorage.setItem("session_id", sessionId);
            } else {
                console.log("기존 세션 사용:", sessionId);
            }

            // 2단계: 채팅 요청
            console.log("채팅 요청 전송 중...");
            const chatResponse = await fetch('http://localhost:8000/agent/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "prompt": inputValue,
                    "session_id": sessionId
                })
            });

            if (!chatResponse.ok) {
                throw new Error(`채팅 요청 실패: ${chatResponse.status}`);
            }

            // 3단계: 응답 처리
            const result = await chatResponse.json();
            console.log("채팅 응답:", result);

            // 4단계: 컴포넌트 설정 (조건부)
            if (result.data.answer_type === "dashboard") {
                console.log("대시보드 컴포넌트 설정 중...");
                chatbotProps.setComponents(result.data.components);
            }

            // 5단계: 세션 ID 업데이트 (응답에서 새로운 세션 ID가 온 경우)
            if (result.data.session_id) {
                sessionStorage.setItem("session_id", result.data.session_id);
            }

            // 6단계: 최종 응답 설정
            responseText = result.data.answer; // 로컬 변수에 저장
            setApiResponse(responseText);
            console.log("처리 완료");

        } catch (error) {
            console.error('Error:', error);
            responseText = 'Agent 호출에 실패했습니다. 다시 시도해주세요.';
            setApiResponse(responseText);
        } finally {
            setIsTyping(false);

            // 이제 responseText는 정확한 값을 가집니다
            const aiMessage = {
                id: messages.length + 2,
                text: responseText, // apiResponse 대신 responseText 사용
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            setMessages(prev => [...prev, aiMessage]);
        }
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

        {/* 여기에 API 구현*/}
        await agentRequest();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        sessionStorage.removeItem('session_id');
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
        <div className="w-[100%] h-[90vh] bg-gray-50 flex flex-col mx-auto">
            {/* 상단 헤더 */}
            <div className="h-[70px] bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
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
                        {/*<button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">*/}
                        {/*    <Settings className="w-4 h-4" />*/}
                        {/*</button>*/}
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
