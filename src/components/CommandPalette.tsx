import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, CornerDownLeft, FileText, MapPin, Search, X } from 'lucide-react';
import { CAMPUS_BLOCKS, OFFICIAL_NOTICES, CampusBlock, OfficialNotice } from '../data/maitData';

type CommandPaletteProps = {
	isOpen: boolean;
	onClose: () => void;
	onSelectBlock: (block: CampusBlock) => void;
	onSelectNotice: (notice: OfficialNotice) => void;
};

type PaletteResult =
	| { kind: 'block'; id: string; title: string; detail: string; value: CampusBlock }
	| { kind: 'notice'; id: string; title: string; detail: string; value: OfficialNotice };

export const CommandPalette: React.FC<CommandPaletteProps> = ({
	isOpen,
	onClose,
	onSelectBlock,
	onSelectNotice,
}) => {
	const [query, setQuery] = useState('');
	const [activeIndex, setActiveIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	const results = useMemo<PaletteResult[]>(() => {
		const normalizedQuery = query.trim().toLowerCase();
		const blocks: PaletteResult[] = CAMPUS_BLOCKS.map((block) => ({
			kind: 'block',
			id: `block-${block.id}`,
			title: block.name,
			detail: `${block.category} · ${block.departments.join(', ')}`,
			value: block,
		}));
		const notices: PaletteResult[] = OFFICIAL_NOTICES.map((notice) => ({
			kind: 'notice',
			id: `notice-${notice.id}`,
			title: notice.title,
			detail: `${notice.category} · ${notice.date}`,
			value: notice,
		}));

		return [...blocks, ...notices]
			.filter((result) => !normalizedQuery || `${result.title} ${result.detail}`.toLowerCase().includes(normalizedQuery))
			.slice(0, 12);
	}, [query]);

	useEffect(() => {
		if (!isOpen) return;
		setQuery('');
		setActiveIndex(0);
		inputRef.current?.focus();
	}, [isOpen]);

	if (!isOpen) return null;

	const selectResult = (result: PaletteResult) => {
		if (result.kind === 'block') onSelectBlock(result.value);
		else onSelectNotice(result.value);
		onClose();
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			onClose();
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			setActiveIndex((index) => Math.max(index - 1, 0));
		} else if (event.key === 'Enter' && results[activeIndex]) {
			event.preventDefault();
			selectResult(results[activeIndex]);
		}
	};

	return (
		<div
			className="fixed inset-0 z-[70] flex items-start justify-center bg-[#203044]/40 px-4 pt-[12vh] backdrop-blur-sm"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
		>
			<section role="dialog" aria-modal="true" aria-label="Search MAIT campus" className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#203044]/15 bg-white shadow-2xl">
				<div className="flex items-center gap-3 border-b border-[#203044]/10 px-4">
					<Search className="h-5 w-5 shrink-0 text-[#16745B]" aria-hidden="true" />
					<input
						ref={inputRef}
						role="combobox"
						aria-expanded="true"
						aria-controls="command-palette-results"
						aria-activedescendant={results[activeIndex] ? `command-result-${results[activeIndex].id}` : undefined}
						aria-label="Search campus buildings and official notices"
						value={query}
						onChange={(event) => {
							setQuery(event.target.value);
							setActiveIndex(0);
						}}
						onKeyDown={handleKeyDown}
						placeholder="Search buildings, departments, or notices..."
						className="h-14 min-w-0 flex-1 bg-transparent text-sm text-[#203044] outline-none placeholder:text-[#657080]"
					/>
					<button type="button" onClick={onClose} aria-label="Close search" className="rounded-md p-2 text-[#657080] hover:bg-[#F7F5EF] hover:text-[#203044]">
						<X className="h-4 w-4" />
					</button>
				</div>

				<div id="command-palette-results" role="listbox" className="max-h-[55vh] overflow-y-auto p-2">
					{results.length === 0 ? (
						<p className="px-3 py-8 text-center text-sm text-[#657080]">No matching campus locations or notices.</p>
					) : results.map((result, index) => (
						<button
							key={result.id}
							id={`command-result-${result.id}`}
							type="button"
							role="option"
							aria-selected={index === activeIndex}
							onMouseEnter={() => setActiveIndex(index)}
							onClick={() => selectResult(result)}
							className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left ${index === activeIndex ? 'bg-[#F7F5EF]' : 'hover:bg-[#F7F5EF]'}`}
						>
							<span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${result.kind === 'block' ? 'bg-emerald-50 text-[#16745B]' : 'bg-rose-50 text-[#873A2B]'}`}>
								{result.kind === 'block' ? <MapPin className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
							</span>
							<span className="min-w-0 flex-1">
								<span className="block truncate text-sm font-semibold text-[#203044]">{result.title}</span>
								<span className="mt-0.5 block truncate text-[11px] capitalize text-[#657080]">{result.detail}</span>
							</span>
							{index === activeIndex && <CornerDownLeft className="h-4 w-4 shrink-0 text-[#657080]" aria-hidden="true" />}
						</button>
					))}
				</div>

				<div className="flex items-center justify-between border-t border-[#203044]/10 bg-[#F7F5EF]/70 px-4 py-2 text-[10px] text-[#657080]">
					<span>{results.length} results</span>
					<span className="flex items-center gap-3"><span className="flex items-center gap-1"><ArrowUp className="h-3 w-3" /><ArrowDown className="h-3 w-3" /> Navigate</span><span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> Open</span><span>Esc Close</span></span>
				</div>
			</section>
		</div>
	);
};
