const LineClassName = "flex-1 h-[4px] border bg-[var(--main-color)] border-[var(--outline-color)]";

export default function Divider({ text, marginTop = 0, marginBottom = 0 }: { text?: string; marginTop?: number; marginBottom?: number }) {
	return (
		<div className="w-full h-[6px] flex items-center gap-[9px] box-content" style={{ paddingTop: marginTop, paddingBottom: marginBottom }}>
			<div className={LineClassName} />

			{text && (
				<>
					<span className="text-white text-[14px] opacity-50 whitespace-nowrap select-none leading-none">{text}</span>
					<div className={LineClassName} />
				</>
			)}
		</div>
	);
}