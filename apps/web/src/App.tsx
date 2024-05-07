import { Navigate, Route, Routes } from "react-router-dom"
import SignUpPage from "./pages/auth/signup/sign-up-page"
import LoginPage from "./pages/auth/login/login-page"
import HomePage from "./pages/home/home-page"
import Sidebar from "./components/common/sidebar"
import RightPanel from "./components/common/right-panel"
import NotificationPage from "./pages/notification/notification"
import ProfilePage from "./pages/profile/profile-page"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "./components/common/loading-spinner"

const App = () => {

   const { data: authUser, isLoading } = useQuery({
	// This way we can re-use this query along all the project
	 queryKey: ['authUser'],
	 queryFn: async () => {
		try {
			const res = await fetch('/v1/api/auth/me')

			const data = await res.json()

			if (data.success === false) return null

			if (!res.ok) throw new Error(data.message || 'Something went wrong! Please try again later.')

			console.log('Auth user:', data)

			return data
		} catch (error: any) {
			console.log(error)
			throw new Error(error)
		}
	 },
	 // Turn off default tanstack behavior of doing 3 requests if it fails
	 retry: false
   })

   if (isLoading) {
	return (
		<div className="h-screen flex justify-center items-center">
          <LoadingSpinner size="lg"/>
		</div>
	)
   }

  return (
    <div className='flex max-w-6xl mx-auto'>
           {authUser && <Sidebar/>}
			<Routes>
				<Route path='/' element={authUser ? <HomePage/> : <Navigate to={'/login'}/>} />
				<Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to={'/'}/>} />
				<Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to={'/'}/>} />
				<Route path='/notifications' element={authUser ? <NotificationPage/> : <Navigate to={'/login'}/>} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage/> : <Navigate to={'/login'}/>} />
			</Routes>
           {authUser && <RightPanel/>}
		   <Toaster toastOptions={{ style: { background: '#333', color: '#fff' }}}/>
		</div>
  )
}

export default App
