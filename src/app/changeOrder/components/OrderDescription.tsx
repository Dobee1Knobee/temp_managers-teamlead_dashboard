import { useOrderStore } from "@/stores/orderStore";

export default function OrderDescription(){
    const {
        formData,
        updateFormData,
        isViewMode,
    } = useOrderStore();
    return(
        <div className={"bg-white shadow-md rounded-2xl p-6 m-9 w-full max-w-xl items-center"}>
            <div className="flex items-center mb-4">
                <span className="h-3 w-3 bg-green-600 rounded-full mr-2"></span>
                <h2 className="text-lg font-semibold text-gray-900">Order description</h2>
            </div>
            <textarea
                disabled={isViewMode}
                className={`rounded-2xl w-full h-20 p-4 border border-gray-200 resize-none ${
                    isViewMode 
                        ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-50 text-gray-700'
                }`}
                placeholder="Example: 50 60 70 inch, 50 outside, 60 broken mount dismount"
                value={formData.description}
                onChange={(e => updateFormData("description", e.currentTarget.value))}
            />
        </div>
    )
}