import { Icon } from "@iconify/react/dist/iconify.js";

const SideNavBar = () => {
    return (
        <div className="h-screen w-60 border border-gray-200 fixed left-0">
           
            <nav className="flex items-center gap-70 flex-1 px-6 text-lg">
                <ul>

                    <li>
                        <button className="nav-button flex gap-3 items-center">
                            <Icon icon="tabler:home" /> Home
                        </button>
                    </li>

                    <li>
                        <button className="nav-button flex gap-3 items-center">
                            <Icon icon="uil:calender" /> Events
                        </button>
                    </li>

                    <li>
                        <button className="nav-button flex gap-3 items-center">
                            <Icon icon="pepicons-print:people" /> Volunteers
                        </button>
                    </li>

                    <li>
                        <button className="nav-button flex gap-3 items-center">
                            <Icon icon="mynaui:envelope" /> Communication
                        </button>
                    </li>

                    <li>
                        <button className="nav-button flex gap-3 items-center">
                            <Icon icon="charm:person" /> Profile
                        </button>
                    </li>

                    <li>
                        <button className="nav-button flex gap-3 items-center">
                            <Icon icon="tabler:logout" /> Logout
                        </button>
                    </li>

                </ul>
            </nav>



        <footer>
            
        </footer>

        </div>

        
        
        
    );
};

export default SideNavBar;