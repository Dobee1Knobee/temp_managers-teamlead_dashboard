interface RequestCardProps {
	request: {
			id: string;
			type : string;
			name: string;
	};
}
export default function RequestCard({ request }: RequestCardProps) {
    const { id, name, type } = request;


		return (
			<div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-200">
					{/* Header с красной полоской */}
					<div className="relative">
							<div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl"></div>
							<div className="p-5 pl-6">
									<div className="flex items-center justify-between">
											<h2 className="text-lg font-bold text-gray-900">{type}</h2>
											<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													#{id}
											</span>
									</div>
									<p className="text-gray-600 mt-1 font-medium">{name}</p>
							</div>
					</div>
					
					{/* Content с разделителем */}
					<div className="px-5 pb-5">
							<div className="border-t border-gray-200 pt-3 mt-2">
									<div className="flex items-center justify-between">
											<span className="text-sm font-medium text-gray-700">Статус:</span>
											<span className="text-sm text-gray-500">Ожидает обработки</span>
									</div>
							</div>
					</div>
					<div className = "px-2 pb-3"> 
						<button className = "w-full bg-blue-500 text-white px-4 py-2 rounded-lg">
							Claim
						</button>
				
					</div>
			</div>
	)
}