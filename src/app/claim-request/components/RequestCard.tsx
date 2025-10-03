"use client"
interface RequestCardProps {
	request: {
			id: string;
			type : string;
			name: string;
			createdAt: Date;
	};
	onClaim?: (requestId: string) => void;
}
export default function RequestCard({ request, onClaim }: RequestCardProps) {
    const { id, name, type, createdAt } = request;
    
    const now = new Date();
    const minutesDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    const isUrgent = minutesDiff > 15;
    let color = 'bg-blue-500';
    let badgeColor = 'bg-blue-100 text-blue-800';
    
    // Если заявка срочная - делаем её красной независимо от типа
    if (isUrgent) {
        color = 'bg-red-500';
        badgeColor = 'bg-red-100 text-red-800';
    } else {
        // Обычные цвета по типу заявки
        switch (type) {
            case 'site-quiz':
                color = 'bg-blue-500';
                badgeColor = 'bg-blue-100 text-blue-800';
                break;
            case 'site-form':
                color = 'bg-blue-500';
                badgeColor = 'bg-blue-100 text-blue-800';
                break;
            case 'phone-call':
                color = 'bg-green-500';
                badgeColor = 'bg-green-100 text-green-800';
                break;
            case 'chat':
                color = 'bg-purple-500';
                badgeColor = 'bg-purple-100 text-purple-800';
                break;
            default:
                color = 'bg-gray-500';
                badgeColor = 'bg-gray-100 text-gray-800';
        }
    }
		return (
			<div className="h-full w-full bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-200 flex flex-col">
				
					{/* Header с красной полоской */}
					<div className="relative">
							<div className={`absolute top-0 left-0 w-1 h-full ${color} rounded-l-xl`}></div>
							<div className="p-5 pl-6">
									<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
													<h2 className="text-lg font-bold text-gray-900">{type}</h2>
													{isUrgent && (
															<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
																	Allert!
															</span>
													)}
											</div>
											<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
													#{id}
											</span>
									</div>
									<p className="text-gray-600 mt-1 font-medium">Name: {name}</p>
							</div>
					</div>
				
					{/* Контент с фиксированным низом */}
					<div className="mt-auto">
							{/* Status и дата с разделителем */}
							<div className="px-5 pb-3">
									<div className="border-t border-gray-200 pt-3">
											<div className="flex items-center justify-between mb-2">
													<span className="text-sm font-medium text-gray-700">Статус:</span>
													<span className="text-sm text-gray-500">Ожидает обработки</span>
											</div>
											<div className="flex items-center justify-between">
													<span className="text-sm font-medium text-gray-700">Дата получения:</span>
													<div className="text-right">
															<span className={`text-sm ${isUrgent ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
																{createdAt.toLocaleDateString('ru-RU', {
																	day: '2-digit',
																	month: '2-digit', 
																	year: 'numeric',
																	hour: '2-digit',
																	minute: '2-digit'
																})}
															</span>
															{isUrgent && (
																<div className="text-xs text-red-600 font-medium mt-1">
																	+{minutesDiff} мин.
																</div>
															)}
													</div>
											</div>
									</div>
							</div>
							{/* Кнопка Claim */}
							<div className="px-5 pb-5"> 
									<button 
										onClick={() => onClaim?.(id)}
										className={`w-full ${color} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity`}
									>
											Claim
									</button>
							</div>
					</div>
			</div>
	)
}