import React, { useState } from 'react';
import CustomButton from './CustomButton';

type FixedModalButtonProps = {
    options: string[];               // 드롭다운 목록
    defaultValue: string;            // 기본값 텍스트
    onSelect: (selectedValue: string) => void;  // 부모에게 선택한 값 전달
};

export const FixedModalButton: React.FC<FixedModalButtonProps> = ({
    options,
    defaultValue,
    onSelect,
}) => {
    const [isOpen, setIsOpen] = useState(false);  // 드롭다운 열림/닫힘 상태
    const [selectedValue, setSelectedValue] = useState(defaultValue);  // 선택된 값

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);  // 드롭다운 열기/닫기 토글
    };

    const handleSelect = (value: string) => {
        setSelectedValue(value);  // 선택된 값 업데이트
        onSelect(value);           // 부모 컴포넌트에 선택된 값 전달
        setIsOpen(false);          // 드롭다운 닫기
    };

    return (
        <div className="relative inline-block">
            {/* 드롭다운 버튼 */}
            <button
                type="button" // 폼 제출 방지
                onClick={handleToggleDropdown}
                className="flex items-center justify-between px-2 py-1 border rounded-md bg-white text-gray-700
                text-sm shadow-sm w-full focus:outline-none cursor-pointer"
            >
                {/* <span className="mr-2">{isOpen ? '↑' : '↓'}</span> */}
                <span>{selectedValue}</span> {/* 기본값 텍스트 */}
            </button>

            {/* 드롭다운 목록 */}
            {isOpen && (
                <div className="absolute w-auto mt-2 p-2 bg-white rounded-md shadow-lg z-10 flex gap-2">
                    {/* <ul className="divide-y divide-gray-100"> */}
                    {options.map((option, index) => (
                        <CustomButton
                            // variant='normalFull'
                            className='bg-[#273042] text-white rounded-sm p-2'
                            key={index}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </CustomButton>
                    ))}
                    {/* </ul> */}
                </div>
            )}
        </div>
    );
};
