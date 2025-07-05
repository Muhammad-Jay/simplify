import React from 'react'
import Navbar from "@/components/navigations/Navbar";
import Sidebar from "@/components/navigations/sidebar/Sidebar";
import BackgroundGradient from "@/components/BackgroundGradient";

const Layout = ({children} : { children : React.ReactNode }) => {
    return (
            <main className={'screen relative !bg-transparent between flex-row p-[5px]'}>
                {/*<BackgroundGradient className={"absolute inset-0 w-full h-full"}>*/}
                {/*    <div className={"w-full h-full bg-black/70 z-[3]"}/>*/}
                {/*</BackgroundGradient>*/}
                <div className={'center w-fit h-full'}>
                    <Sidebar/>
                </div>
                <div className={'between !bg-transparent z-[5] page flex-col p-[5px]'}>
                    <section className={'center w-full h-fit'}>
                        <Navbar></Navbar>
                    </section>
                    <section className={'container-full !bg-transparent relative rounded-lg'}>
                        <div className={'absolute inset-0 container-full !bg-transparent rounded-lg overflow-y-auto'} id={'no-scrollbar'}>
                            {children}
                        </div>
                    </section>
                </div>
            </main>
    )
}
export default Layout
