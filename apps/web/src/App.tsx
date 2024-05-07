import { Route, Routes } from "react-router-dom"
import SignUpPage from "./pages/auth/signup/sign-up-page"
import LoginPage from "./pages/auth/login/login-page"
import HomePage from "./pages/home/home-page"
import Sidebar from "./components/common/sidebar"
import RightPanel from "./components/common/right-panel"
import NotificationPage from "./pages/notification/notification"
import ProfilePage from "./pages/profile/profile-page"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar/>
			<Routes>
				<Route path='/' element={<HomePage/>} />
				<Route path='/signup' element={<SignUpPage/>} />
				<Route path='/login' element={<LoginPage/>} />
				<Route path='/notifications' element={<NotificationPage/>} />
				<Route path='/profile/:username' element={<ProfilePage/>} />
			</Routes>
           <RightPanel/>
		   <Toaster toastOptions={{ style: { background: '#333', color: '#fff' }}}/>
		</div>
  )
}

export default App
