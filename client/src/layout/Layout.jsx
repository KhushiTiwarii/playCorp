import React from 'react'
import Routers from '../routes/Routers'
const Layout = () => {
    return (
     <>
     <main>
      <Routers/>
     </main>
     
     </>
    // <div className="h-full relative">
    //   <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-10 bg-gray-600">
    //     <Sidebar />
    //   </div>
    //   <main className="md:pl-72 pb-10">
    //     <Routers/>
    //   </main>
    // </div>
    )
  }
  
  export default Layout