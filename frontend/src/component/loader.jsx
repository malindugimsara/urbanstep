import { VscLoading } from "react-icons/vsc";

export default function Loader() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <VscLoading  className="text-[60px] animate-spin"/>
        </div>
    );
}