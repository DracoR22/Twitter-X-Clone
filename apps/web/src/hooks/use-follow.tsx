import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const useFollow = () => {
	const queryClient = useQueryClient();
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null)

	const { mutate: follow, isPending } = useMutation({
		mutationFn: async ({ userId, i }: any) => {
			try {
                setLoadingIndex(i)
				const res = await fetch(`/v1/api/users/follow/${userId}`, {
					method: "POST",
				});

				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.message || "Something went wrong!");
				}

                setLoadingIndex(null)
				return;
			} catch (error: any) {
                setLoadingIndex(null)
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { follow, isPending, loadingIndex };
};

export default useFollow;