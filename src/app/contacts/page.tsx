"use client"

import ProtectedRoute from '@/components/ProtectedRoute'
import { useOrderStore } from '@/stores/orderStore'
import { MoveLeft, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Header from '../form/components/Header'
import Sidebar from '../form/components/Sidebar'

// Тип для записи звонка
interface CallRecord {
    file_url: string;
    date_time: string;
    client_id: string;
    direction: 'inbound' | 'outbound';
    status: string;
}

export default function ContactsPage() {
	const [isPhoneNumbers, setIsPhoneNumbers] = useState(false);
	const [isRecords, setIsRecords] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [records, setRecords] = useState<CallRecord[]>([]);
    const [resultsType, setResultsType] = useState<'phone' | 'records' | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const { getPhoneNumbers, getRecords,generateClientId } = useOrderStore();
    const [clientId, setClientId] = useState('');
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});
    // Состояние для отслеживания прогресса воспроизведения каждого аудио
    const [audioProgress, setAudioProgress] = useState<{ [key: number]: { currentTime: number; duration: number } }>({});
    const [isDragging, setIsDragging] = useState<number | null>(null);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [isLoadingPhones, setIsLoadingPhones] = useState(false);
    const [isGeneratingClientId, setIsGeneratingClientId] = useState(false);
    const [isGeneratingClientIdForm, setIsGeneratingClientIdForm] = useState(false);
    const [phone, setPhone] = useState('');
    const [generatedClientId, setGeneratedClientId] = useState<string | null>(null);
    
    const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/^#+/, ''); // Удаляем # в начале, если пользователь его ввел
        setClientId(value);
    };

    // Функция для извлечения только цифр из client_id
    const extractNumbers = (value: string): string => {
        // Извлекаем только цифры из строки
        return value.replace(/\D/g, '');
    };

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			setIsPhoneNumbers(false);	
			setIsRecords(false);
            setIsSearching(false);
            setIsGeneratingClientIdForm(false);
            setIsGeneratingClientId(false);
            setPhone('');
            setGeneratedClientId(null);
		}
		};
		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isPhoneNumbers, isRecords, isGeneratingClientIdForm]);


    const handleGenerateClientId = (phone: string) => {
        if (!phone.trim()) return;
        
        setIsGeneratingClientId(true);
        setGeneratedClientId(null); // Сбрасываем предыдущий результат
        
        generateClientId(phone)
            .then((data: any) => {
                console.log('generateClientId response:', data);
                // API возвращает clientId (camelCase), а не client_id
                const clientIdValue = data?.clientId || data?.client_id;
                if (clientIdValue) {
                    setGeneratedClientId(String(clientIdValue));
                    setClientId(String(clientIdValue));
                }
            })
            .catch((error) => {
                console.error('Error generating client_id:', error);
                setGeneratedClientId(null);
            })
            .finally(() => {
                setIsGeneratingClientId(false);
            });
    }
    const handleGetPhoneNumbers = () => {
        // Извлекаем только цифры из client_id
        const cleanClientId = extractNumbers(clientId);
        console.log('Calling getPhoneNumbers with clientId:', cleanClientId, '(original:', clientId, ')');
        // Сначала устанавливаем тип результатов и состояние загрузки
        setResultsType('phone');
        setIsLoadingPhones(true);
        setResults([]); // Очищаем предыдущие результаты
        setIsSearching(false);
        setIsPhoneNumbers(false);
        
        getPhoneNumbers(cleanClientId)
            .then((data: any) => {
                console.log('getPhoneNumbers response:', data);

                let resultsArray: string[] = [];
                if (Array.isArray(data)) {
                    // Если массив объектов, извлекаем поле phone из каждого
                    resultsArray = data.map(item => {
                        if (typeof item === 'string') return item;
                        if (item && typeof item === 'object' && item.phone) return item.phone;
                        return JSON.stringify(item);
                    });
                } else if (data && typeof data === 'object') {
                    // Если один объект, извлекаем поле phone
                    if (data.phone) {
                        resultsArray = [data.phone];
                    } else if (data.phones && Array.isArray(data.phones)) {
                        resultsArray = data.phones.map((item: any) => 
                            typeof item === 'string' ? item : (item?.phone || JSON.stringify(item))
                        );
                    } else if (data.data) {
                        const phones = Array.isArray(data.data) ? data.data : [data.data];
                        resultsArray = phones.map((item: any) => 
                            typeof item === 'string' ? item : (item?.phone || JSON.stringify(item))
                        );
                    } else {
                        resultsArray = [JSON.stringify(data)];
                    }
                } else if (data) {
                    resultsArray = [typeof data === 'string' ? data : JSON.stringify(data)];
                }
                setResults(resultsArray);
            })
            .catch((error) => {
                console.error('Error getting phone numbers:', error);
                setResults([]);
            })
            .finally(() => {
                setIsLoadingPhones(false);
            });
        setClientId('');
    }
    const handleGetRecords = () => {
        // Извлекаем только цифры из client_id
        const cleanClientId = extractNumbers(clientId);
        console.log('Calling getRecords with clientId:', cleanClientId, '(original:', clientId, ')');
        // Сначала устанавливаем тип результатов и состояние загрузки
        setResultsType('records');
        setIsLoadingRecords(true);
        setRecords([]); // Очищаем предыдущие результаты
        setIsSearching(false);
        setIsRecords(false);
        
        getRecords(cleanClientId)
            .then((data: any) => {
                console.log('getRecords response:', data);
                // Сохраняем объекты записей, а не строки
                let recordsArray: CallRecord[] = [];
                if (Array.isArray(data)) {
                    recordsArray = data.filter((item): item is CallRecord => 
                        item && typeof item === 'object' && 'file_url' in item
                    );
                } else if (data && typeof data === 'object') {
                    const recordsData = (data as any).records || (data as any).data || data;
                    if (Array.isArray(recordsData)) {
                        recordsArray = recordsData.filter((item): item is CallRecord => 
                            item && typeof item === 'object' && 'file_url' in item
                        );
                    } else if (recordsData && typeof recordsData === 'object' && 'file_url' in recordsData) {
                        recordsArray = [recordsData as CallRecord];
                    }
                }
                setRecords(recordsArray);
            })
            .catch((error) => {
                console.error('Error getting records:', error);
                setRecords([]);
            })
            .finally(() => {
                setIsLoadingRecords(false);
            });
        setClientId('')
    }

    // Функция для форматирования времени (MM:SS)
    const formatTime = (seconds: number): string => {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Функция для воспроизведения/паузы аудио
    const togglePlay = async (index: number) => {
        const audio = audioRefs.current[index];
        if (!audio) return;

        // Останавливаем все другие аудио
        Object.values(audioRefs.current).forEach((otherAudio, otherIndex) => {
            if (otherAudio && otherIndex !== index) {
                otherAudio.pause();
                otherAudio.currentTime = 0;
            }
        });

        if (playingIndex === index) {
            // Если это текущее аудио - ставим на паузу
            audio.pause();
            setPlayingIndex(null);
        } else {
            // Если другое аудио - переключаемся на это
            try {
                setPlayingIndex(index);
                await audio.play();
            } catch (error) {
                console.error('Error playing audio:', error);
                setPlayingIndex(null);
            }
        }
    }

    // Обработчик изменения позиции при перетаскивании ползунка
    const handleSeek = (index: number, newTime: number) => {
        const audio = audioRefs.current[index];
        if (audio) {
            audio.currentTime = newTime;
            setAudioProgress(prev => ({
                ...prev,
                [index]: {
                    ...prev[index],
                    currentTime: newTime
                }
            }));
        }
    }

    // Обработчик начала перетаскивания
    const handleSeekStart = (index: number) => {
        setIsDragging(index);
    }

    // Обработчик окончания перетаскивания
    const handleSeekEnd = (index: number, newTime: number) => {
        setIsDragging(null);
        handleSeek(index, newTime);
    }

    // Обработчик обновления времени воспроизведения
    const handleTimeUpdate = (index: number) => {
        if (isDragging === index) return; // Не обновляем во время перетаскивания
        
        const audio = audioRefs.current[index];
        if (audio) {
            setAudioProgress(prev => ({
                ...prev,
                [index]: {
                    currentTime: audio.currentTime,
                    duration: audio.duration || 0
                }
            }));
        }
    }

    // Обработчик загрузки метаданных (для получения длительности)
    const handleLoadedMetadata = (index: number) => {
        const audio = audioRefs.current[index];
        if (audio) {
            setAudioProgress(prev => ({
                ...prev,
                [index]: {
                    currentTime: audio.currentTime || 0,
                    duration: audio.duration || 0
                }
            }));
        }
    }

    // Очистка аудио при размонтировании
    useEffect(() => {
        return () => {
            Object.values(audioRefs.current).forEach((audio) => {
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
            });
        };
    }, []);
	return (
        <ProtectedRoute>
            <div className="h-screen flex bg-gray-50 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 text-2xl font-bold">
                            <h1>Get phone numbers or records by #client_id</h1>
                        </div>
                        {!isSearching && (
                            <div className="mx-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex w-full justify-center gap-2">
                                        <button 
                                            onClick={() => {setIsSearching(true); setIsPhoneNumbers(true)}}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200 font-medium"
                                        >
                                            Get phone numbers
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsSearching(true);
                                                setIsGeneratingClientIdForm(true);
                                            }}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors duration-200 font-medium"
                                        >
                                            Generate client_id
                                        </button>
                                        <button 
                                            onClick={() => {setIsSearching(true); setIsRecords(true);}}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200 font-medium"
                                        >
                                            Get records
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isGeneratingClientIdForm && isSearching && (
                            <div className="mx-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <button 
                                        onClick={() => {
                                            setIsGeneratingClientIdForm(false);
                                            setIsSearching(false);
                                            setPhone('');
                                            setGeneratedClientId(null);
                                        }}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <MoveLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="flex w-full gap-2">
                                        <div className="flex-1 relative">
                                            <input 
                                                type="text" 
                                                placeholder="phone" 
                                                className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300" 
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && phone.trim() && !isGeneratingClientId) {
                                                        handleGenerateClientId(phone);
                                                    }
                                                }}
                                                disabled={isGeneratingClientId}
                                            />
                                        </div>
                                        <button 
                                            onClick={() => handleGenerateClientId(phone)}
                                            disabled={!phone.trim() || isGeneratingClientId}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isGeneratingClientId ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Generating...
                                                </span>
                                            ) : (
                                                'Generate client_id'
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Отображение результата */}
                                {generatedClientId && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm text-green-800 font-medium mb-1">Generated Client ID:</p>
                                                <p className="text-lg font-semibold text-green-900">#c{generatedClientId}</p>
                                            </div>
                                            <button
                                                onClick={async (e) => {
                                                    try {
                                                        // Копируем в формате #c + цифры
                                                        await navigator.clipboard.writeText(`#c${generatedClientId}`);
                                                        // Временно меняем текст кнопки для обратной связи
                                                        const button = e.currentTarget;
                                                        const originalText = button.textContent;
                                                        button.textContent = 'Copied!';
                                                        button.classList.add('bg-green-600');
                                                        setTimeout(() => {
                                                            if (button) {
                                                                button.textContent = originalText;
                                                                button.classList.remove('bg-green-600');
                                                            }
                                                        }, 2000);
                                                    } catch (error) {
                                                        console.error('Failed to copy:', error);
                                                    }
                                                }}
                                                className="ml-4 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {isPhoneNumbers && (
                            <div className="mx-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => {
                                            setIsSearching(false); 
                                            setIsPhoneNumbers(false);
                                            setResults([]);
                                            setRecords([]);
                                            setResultsType(null);
                                            setIsLoadingPhones(false);
                                            setIsLoadingRecords(false);
                                        }}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <MoveLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="flex w-full gap-2">
                                        <div className="flex-1 relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">#</span>
                                            <input 
                                                type="text" 
                                                placeholder="client_id" 
                                                className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300" 
                                                value={clientId}
                                                onChange={handleClientIdChange}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleGetPhoneNumbers}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            Get phone numbers
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isRecords && isSearching && (
                            <div className="mx-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => {
                                            setIsRecords(false);
                                            setIsSearching(false);
                                            setResults([]);
                                            setRecords([]);
                                            setResultsType(null);
                                            setPlayingIndex(null);
                                            setAudioProgress({});
                                            setIsLoadingPhones(false);
                                            setIsLoadingRecords(false);
                                            // Останавливаем все аудио
                                            Object.values(audioRefs.current).forEach((audio) => {
                                                if (audio) {
                                                    audio.pause();
                                                    audio.currentTime = 0;
                                                }
                                            });
                                        }}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <MoveLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="flex w-full gap-2">
                                        <div className="flex-1 relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">#</span>
                                            <input 
                                                type="text" 
                                                placeholder="client_id" 
                                                className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                                                value={clientId}
                                                onChange={handleClientIdChange}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleGetRecords}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            Get records
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {resultsType === 'phone' && (
                            <div className="mx-6 mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-xl font-semibold mb-4">Phone Numbers</h2>
                                
                                {/* Индикатор загрузки */}
                                {isLoadingPhones && (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                                        <p className="text-gray-600 text-sm">Загрузка телефонов...</p>
                                    </div>
                                )}
                                
                                {/* Сообщение, если телефонов нет */}
                                {!isLoadingPhones && results.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="text-gray-400 mb-3">
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600 text-lg font-medium mb-1">Телефоны не найдены</p>
                                        <p className="text-gray-500 text-sm">Для данного client_id нет доступных телефонов</p>
                                    </div>
                                )}
                                
                                {/* Список телефонов */}
                                {!isLoadingPhones && results.length > 0 && (
                                    <div className="space-y-2">
                                        {results.map((result, index) => (
                                            <div 
                                                key={index}
                                                className="p-3 bg-gray-50 rounded-lg border border-gray-200 break-words"
                                            >
                                                {result}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {resultsType === 'records' && (
                            <div className="mx-6 mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-xl font-semibold mb-4">Call Records</h2>
                                
                                {/* Индикатор загрузки */}
                                {isLoadingRecords && (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                                        <p className="text-gray-600 text-sm">Загрузка записей...</p>
                                    </div>
                                )}
                                
                                {/* Сообщение, если записей нет */}
                                {!isLoadingRecords && records.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="text-gray-400 mb-3">
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600 text-lg font-medium mb-1">Записи не найдены</p>
                                        <p className="text-gray-500 text-sm">Для данного client_id нет доступных записей</p>
                                    </div>
                                )}
                                
                                {/* Список записей */}
                                {!isLoadingRecords && records.length > 0 && (
                                    <div className="space-y-3">
                                        {records.map((record, index) => {
                                        const isPlaying = playingIndex === index;
                                        const date = new Date(record.date_time);
                                        const formattedDate = date.toLocaleString('ru-RU', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });
                                        
                                        const progress = audioProgress[index] || { currentTime: 0, duration: 0 };
                                        const progressPercent = progress.duration > 0 
                                            ? (progress.currentTime / progress.duration) * 100 
                                            : 0;
                                        
                                        return (
                                            <div 
                                                key={index}
                                                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="text-sm text-gray-600 mb-1">
                                                            <span className="font-medium">Client ID:</span> {record.client_id}
                                                        </div>
                                                        <div className="text-sm text-gray-600 mb-1">
                                                            <span className="font-medium">Date:</span> {formattedDate}
                                                        </div>
                                                        <div className="text-sm text-gray-600 mb-1">
                                                            <span className="font-medium">Direction:</span> {record.direction}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            <span className="font-medium">Status:</span> {record.status}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => togglePlay(index)}
                                                        className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                                        aria-label={isPlaying ? 'Pause' : 'Play'}
                                                    >
                                                        {isPlaying ? (
                                                            <Pause className="w-5 h-5" />
                                                        ) : (
                                                            <Play className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                                
                                                {/* Ползунок для перемотки */}
                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className="text-xs text-gray-500 min-w-[40px] text-right">
                                                        {formatTime(progress.currentTime)}
                                                    </span>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max={progress.duration || 0}
                                                        value={progress.currentTime}
                                                        step="0.1"
                                                        onChange={(e) => handleSeek(index, parseFloat(e.target.value))}
                                                        onMouseDown={() => handleSeekStart(index)}
                                                        onMouseUp={(e) => {
                                                            const target = e.currentTarget;
                                                            handleSeekEnd(index, parseFloat(target.value));
                                                        }}
                                                        onTouchStart={() => handleSeekStart(index)}
                                                        onTouchEnd={(e) => {
                                                            const target = e.currentTarget;
                                                            handleSeekEnd(index, parseFloat(target.value));
                                                        }}
                                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                        style={{
                                                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercent}%, #e5e7eb ${progressPercent}%, #e5e7eb 100%)`
                                                        }}
                                                    />
                                                    <span className="text-xs text-gray-500 min-w-[40px]">
                                                        {formatTime(progress.duration)}
                                                    </span>
                                                </div>
                                                
                                                {/* Audio элемент для воспроизведения */}
                                                <audio
                                                    ref={(el) => {
                                                        audioRefs.current[index] = el;
                                                    }}
                                                    src={record.file_url}
                                                    preload="metadata"
                                                    onEnded={() => {
                                                        setPlayingIndex(null);
                                                        setAudioProgress(prev => ({
                                                            ...prev,
                                                            [index]: {
                                                                ...prev[index],
                                                                currentTime: 0
                                                            }
                                                        }));
                                                    }}
                                                    onTimeUpdate={() => handleTimeUpdate(index)}
                                                    onLoadedMetadata={() => handleLoadedMetadata(index)}
                                                />
                                            </div>
                                        );
                                    })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}