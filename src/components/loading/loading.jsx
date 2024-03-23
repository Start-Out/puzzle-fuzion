import { PuffLoader } from 'react-spinners';

export default function Loading () {
    return (
        <section className="fixed inset-0 bg-gradient-to-b from-hackathon-dark-blue to-hackathon-dark-gradient flex justify-center items-center z-50">
            <div className="text-center">
                <PuffLoader color="#ffffff" size={150} />
                <div className="select-none cursor-default text-white pt-8 text-lg italic">Checking...</div>
            </div>
        </section>
    );
}