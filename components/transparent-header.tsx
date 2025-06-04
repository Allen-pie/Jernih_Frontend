import Image from "next/image";
export function TransparentHeader(){
    return (
        <header className="absolute z-99 top-4">
            <Image
                      src={'/assets/jernihLogo.svg'}
                      width={150}
                      height={100}
                      alt="Jernih Logo"
                      className="transition-opacity duration-300 opacity-100"
                      priority
            />
        </header>
    )
}