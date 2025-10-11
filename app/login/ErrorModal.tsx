// components/ErrorModal.tsx
import CustomModal from "../components/CustomModal";

interface Props {
	isOpen: boolean;
	message: string;
	onClose: () => void;
}

export default function ErrorModal({ isOpen, message, onClose }: Props) {
	return (
		<CustomModal isOpen={isOpen} onClose={onClose} variant={2} width="max-w-2xl">
			<div className="p-4 text-center">
				<h3 className="text-lg font-semibold mb-2">알림</h3>
				<p className="text-gray-700 mb-4">{message}</p>
			</div>
		</CustomModal>
	);
}
