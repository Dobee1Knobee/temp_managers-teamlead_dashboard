import { Clock, FileText, User } from 'lucide-react'

interface UnclaimedOrder {
    _id?: string;
    client_id: string;
    orderData: {
        order_id: number;
        client_name: string;
        text: string;
        team: string;
        date: string;
    };
}

interface UnclaimedOrderCardProps {
    order: UnclaimedOrder;
    onClaim: () => void;
}

export default function UnclaimedOrderCard({ order, onClaim }: UnclaimedOrderCardProps) {
    const { _id, client_id, orderData } = order;
    const { order_id, client_name, text, team, date } = orderData;
    
    // Format date
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—'
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return dateStr;
        }
    }
    
    // Get short ID for display
    const displayOrderId = order_id
    
    // Extract key info from text
    const extractTextInfo = (text: string) => {
        if (!text) return { type: '', answers: '', leadId: '' }
        
        // Extract type: "Type: TV"
        const typeMatch = text.match(/Type:\s*([^\n]+)/i)
        const type = typeMatch ? typeMatch[1].trim() : ''
        
        // Extract answers section
        const answersMatch = text.match(/📝\s*Ответы на вопросы:\s*([^🆔]+)/s)
        const answers = answersMatch ? answersMatch[1].trim() : ''
        
        // Extract lead ID: "🆔 ID заявки: 3453463456"
        const leadIdMatch = text.match(/🆔\s*ID заявки:\s*([^\n]+)/i)
        const leadId = leadIdMatch ? leadIdMatch[1].trim() : ''
        
        return { type, answers, leadId }
    }
    
    const { type, answers, leadId } = extractTextInfo(text || '')
    
    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-2.5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-300">
            {/* Header with customer info */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <User size={13} className="text-green-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800 truncate">
                            {client_name || 'No name'}
                        </span>
                    </div>
                    
                </div>
            </div>

            {/* Order Details - Compact but beautiful */}
            <div className="bg-white/60 rounded border border-green-100 p-2 mb-2">
                <div className="flex items-center gap-1.5 mb-2">
                    <FileText size={13} className="text-green-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-green-800">Order Details</span>
                </div>
                
                {/* Type */}
                {type && (
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-gray-600 font-medium">Type:</span>
                        <span className="text-gray-800 font-semibold text-right max-w-36 truncate bg-blue-50 px-1.5 py-0.5 rounded text-xs">{type}</span>
                    </div>
                )}
                
                {/* Date */}
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600 font-medium">Date:</span>
                    <span className="text-gray-800 font-semibold text-right max-w-36 truncate bg-gray-50 px-1.5 py-0.5 rounded text-xs">{formatDate(date)}</span>
                </div>
                
                {/* Order ID */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">ID:</span>
                    <span className="text-gray-800 font-semibold text-right max-w-36 truncate bg-purple-50 px-1.5 py-0.5 rounded text-xs">{displayOrderId}</span>
                </div>
            </div>
            
            {/* Action Button - Compact but beautiful */}
            <div className='pt-1.5 border-t border-green-200'>
                <button
                    onClick={onClaim}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                >
                    <Clock size={13} />
                    Claim Order
                </button>
            </div>
        </div>
    )
}
