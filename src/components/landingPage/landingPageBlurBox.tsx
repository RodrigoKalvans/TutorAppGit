

// TODO: Make sure types are correct
export default function LandingPageBlurBox({ children, style = "" }: { children: React.ReactNode, style?: string }) {

    return (
        <>
        <div className={`${style} w-4/5 mt-20 rounded-4xl p-6 pb-10 shadow-xl`}>
            {children}
        </div>
        </>
    )
}