export function PaymentItem({ icon, name }: { icon: string; name: string }) {
    return (
        <div> 
            {
                // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                <img src={`/images/icons/${icon}`} className={"absolute align-middle object-contain w-6 h-6"} style={{ margin: "0" }} />
            }
            <span className={"m-8"}>{name}</span> 
        </div>
    )
}