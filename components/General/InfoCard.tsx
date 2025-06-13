export interface InfoCardProps {
    title: string;
    content: string;
    backgroundColor?: string;
    borderColor?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
                                                      title,
                                                      content,
                                                      backgroundColor = 'bg-blue-50',
                                                      borderColor
                                                  }) => {
    return (
        <div
            className={`${backgroundColor} rounded-2xl p-4 space-y-2`}
            style={borderColor ? { border: `2px solid ${borderColor}` } : {}}
        >
            <h3 className="font-bold text-gray-800 mb-3">{title}</h3>
            {content}
        </div>
    );
};
