"use client";

import { ErrorView } from "@/components/entity-components";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="p-4 md:px-10 md:py-6 h-full">
			<div className="mx-auto max-w-screen-xl w-full h-full flex flex-col gap-y-4 justify-center">
				<ErrorView message={error.message || "Something went wrong."} />
				<div className="flex justify-center">
					<button
						type="button"
						className="px-4 py-2 rounded-md border text-sm"
						onClick={() => reset()}
					>
						Try again
					</button>
				</div>
			</div>
		</div>
	);
}

