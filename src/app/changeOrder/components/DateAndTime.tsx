import { useOrderStore } from "@/stores/orderStore";

export default function DateAndTime() {
    const { formData, updateFormData, isViewMode } = useOrderStore();

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 m-9 w-full max-w-xl">
            <div className="flex items-center mb-4">
                <span className="h-3 w-3 bg-violet-500 rounded-full mr-2"></span>
                <h2 className="text-lg font-semibold text-gray-900">Date and Time</h2>
            </div>

            <div className="flex items-center mb-4 gap-4">
                <input
                    type="date"
                    disabled={isViewMode}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-violet-400 transition ${
                        isViewMode 
                            ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-50 text-gray-700'
                    }`}
                    value={formData.date || ""}                         // ← читаем из стора
                    onChange={(e) => updateFormData("date", e.target.value)}
                />

                <input
                    type="text"
                    placeholder="1PM"
                    disabled={isViewMode}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-violet-400 transition ${
                        isViewMode 
                            ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-50 text-gray-700'
                    }`}
                    value={formData.time || ""}                         // ← читаем из стора
                    onChange={(e) => updateFormData("time", e.target.value)}
                />
            </div>
        </div>
    );
}
