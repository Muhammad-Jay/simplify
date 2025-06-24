import React from 'react'
import Navbar from "@/components/navigations/Navbar";
import Sidebar from "@/components/navigations/sidebar/Sidebar";

const Layout = ({children} : { children : React.ReactNode }) => {
    return (
        <main className={'screen between bg-primary flex-row p-[5px]'}>
            <div className={'center w-fit h-full'}>
                <Sidebar/>
            </div>
            <div className={'between page flex-col p-[5px]'}>
                <section className={'center w-full h-fit'}>
                    <Navbar></Navbar>
                </section>
                <section className={'container-full relative rounded-lg'}>
                    <div className={'absolute inset-0 container-full rounded-lg overflow-y-auto'} id={'no-scrollbar'}>
                        {children}
                    </div>
                </section>
            </div>
        </main>
    )
}
export default Layout
