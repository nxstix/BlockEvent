import Particles from "react-tsparticles";
import successconfig from "./config/successConfig";
import { loadFull } from "tsparticles"
import Button from 'react-bootstrap/Button';
import { ProgressBar } from "react-bootstrap";
import { useState, useEffect } from "react"
import Link from 'next/link';

export default function SuccessPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 10000);
        return () => clearTimeout(timer);
    }, []);
    const particlesInit = async (main) => {
        await loadFull(main);
    }

    return (
        <div>
            {isLoading ? (
                <>
                    <h2 className="text-center">Generating NFT...</h2>
                    <ProgressBar animated now={100} />
                </>
            ) : (
                <>
                    <Particles init={particlesInit} options={successconfig}></Particles>
                    <p id="success">NFT-Ticket successfully minted!</p>
                    <Link href="/userTickets">
                        <Button variant="outline-secondary" size="sm" className="shadow-sm" id="successbutton">Show Ticket</Button>
                    </Link>
                </>
            )}
        </div>
    )
}