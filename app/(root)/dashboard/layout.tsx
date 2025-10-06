import React from 'react'
import Navbar from "@/components/navigations/Navbar";
import Sidebar from "@/components/navigations/sidebar/Sidebar";
import BackgroundGradient from "@/components/BackgroundGradient";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import MainSidebar from "@/components/navigations/sidebar/MainSidebar";
import {cn} from "@/lib/utils";

const Layout = ({children} : { children : React.ReactNode }) => {
    return (
        <SidebarProvider>
            <main className={'screen relative !bg-black between flex-row !p-0'}>
                <MainSidebar/>
                <div className={'center flex-col !justify-start container-full'}>
                    <section
                        className={'center backdrop-blur-lg p-[7px] !pl-0 w-full h-fit'}>
                        <Navbar></Navbar>
                    </section>
                    <div className={'between !bg-transparent z-[5] page !p-0 flex-col'}>
                        <section className={'container-full !bg-transparent rounded-lg'}>
                            <div className={'inset-0 container-full !bg-transparent rounded-lg overflow-y-auto'} id={'no-scrollbar'}>
                                {children}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </SidebarProvider>
    )
}
export default Layout
