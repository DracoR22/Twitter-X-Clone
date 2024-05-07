import Post from "./post";
import PostSkeleton from "../skeletons/post-skeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface Props {
	feedType: 'forYou' | 'following'
}

const Posts = ({ feedType }: Props) => {

	const getPostEndpoint = () => {
      switch (feedType){
		case 'forYou':
			return '/v1/api/posts/all'
		case 'following':
			return '/v1/api/posts/following'
		default:
			return '/v1/api/posts/all'
	  }
	}

	const POST_ENDPOINT = getPostEndpoint()

	const { data: posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
           try {
			 const res = await fetch(POST_ENDPOINT)

			 const data = await res.json()

			 if (!res.ok) throw new Error(data.message || 'Something went wrong! Please try again later')

			 return data
		   } catch (error: any) {
			 throw new Error(error)
		   }
		}
	})

	useEffect(() => {
      refetch()
	}, [feedType, refetch])

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post: any) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;