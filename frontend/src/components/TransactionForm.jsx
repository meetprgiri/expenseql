import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutation/transaction.mutation";
import toast from "react-hot-toast";

const TransactionForm = () => {
    const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
        refetchQueries: ["GetTransactions", "GetTransactionStatistics"]
    });

    const [errors, setErrors] = useState({});

    const validateForm = (data) => {
        const errors = {};

        if (!data.description) errors.description = "Description is required.";
        if (!data.paymentType) errors.paymentType = "Payment type is required.";
        if (!data.category) errors.category = "Category is required.";
        if (!data.amount || isNaN(data.amount) || data.amount <= 0)
            errors.amount = "Valid amount is required.";
        if (!data.location) errors.location = "Location is required.";
        if (!data.date) errors.date = "Date is required.";

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const transactionData = {
            description: formData.get("description"),
            paymentType: formData.get("paymentType"),
            category: formData.get("category"),
            amount: parseFloat(formData.get("amount")),
            location: formData.get("location"),
            date: formData.get("date") || new Date().toISOString().slice(0, 10)
        };

        const validationErrors = validateForm(transactionData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            await createTransaction({ variables: { input: transactionData } });
            form.reset();
            setErrors({});
            toast.success("Transaction created successfully!");
        } catch (error) {
            toast.error("Failed to create transaction.");
            console.error("Error occurred:", error);
        }
    };

    return (
        <form
            className="w-full max-w-lg flex flex-col gap-5 px-3"
            onSubmit={handleSubmit}
        >
            {/* TRANSACTION */}
            <div className="flex flex-wrap">
                <div className="w-full">
                    <label
                        className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                        htmlFor="description"
                    >
                        Transaction
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="description"
                        name="description"
                        type="text"
                        required
                        placeholder="Rent, Groceries, Salary, etc."
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs italic">{errors.description}</p>
                    )}
                </div>
            </div>

            {/* PAYMENT TYPE */}
            <div className="flex flex-wrap gap-3">
                <div className="w-full flex-1 mb-6 md:mb-0">
                    <label
                        className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                        htmlFor="paymentType"
                    >
                        Payment Type
                    </label>
                    <div className="relative">
                        <select
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="paymentType"
                            name="paymentType"
                        >
                            <option value={"card"}>Card</option>
                            <option value={"cash"}>Cash</option>
                        </select>
                        {errors.paymentType && (
                            <p className="text-red-500 text-xs italic">{errors.paymentType}</p>
                        )}
                    </div>
                </div>

                {/* CATEGORY */}
                <div className="w-full flex-1 mb-6 md:mb-0">
                    <label
                        className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                        htmlFor="category"
                    >
                        Category
                    </label>
                    <div className="relative">
                        <select
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="category"
                            name="category"
                        >
                            <option value={"saving"}>Saving</option>
                            <option value={"expense"}>Expense</option>
                            <option value={"investment"}>Investment</option>
                        </select>
                        {errors.category && (
                            <p className="text-red-500 text-xs italic">{errors.category}</p>
                        )}
                    </div>
                </div>

                {/* AMOUNT */}
                <div className="w-full flex-1 mb-6 md:mb-0">
                    <label
                        className="block uppercase text-white text-xs font-bold mb-2"
                        htmlFor="amount"
                    >
                        Amount($)
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="150"
                    />
                    {errors.amount && (
                        <p className="text-red-500 text-xs italic">{errors.amount}</p>
                    )}
                </div>
            </div>

            {/* LOCATION */}
            <div className="flex flex-wrap gap-3">
                <div className="w-full flex-1 mb-6 md:mb-0">
                    <label
                        className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                        htmlFor="location"
                    >
                        Location
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="location"
                        name="location"
                        type="text"
                        placeholder="New York"
                    />
                    {errors.location && (
                        <p className="text-red-500 text-xs italic">{errors.location}</p>
                    )}
                </div>

                {/* DATE */}
                <div className="w-full flex-1">
                    <label
                        className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                        htmlFor="date"
                    >
                        Date
                    </label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        placeholder="Select date"
                    />
                    {errors.date && (
                        <p className="text-red-500 text-xs italic">{errors.date}</p>
                    )}
                </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
                className="text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600 disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
            >
                {loading ? "Loading..." : "Add Transaction"}
            </button>
        </form>
    );
};

export default TransactionForm;
