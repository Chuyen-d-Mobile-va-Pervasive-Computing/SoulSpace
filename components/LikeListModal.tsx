import { Modal, View, Text, TouchableWithoutFeedback, FlatList, TouchableOpacity, Image } from "react-native";
import { X } from "lucide-react-native";

interface User {
    userId: string;
    username: string;
    avatarUrl?: string | null;
}

interface LikeListModalProps {
    visible: boolean;
    onClose: () => void;
    users: User[];
    currentUserId: string;
}

export default function LikeListModal({ visible, onClose, users, currentUserId }: LikeListModalProps) {
    const renderItem = ({ item }: { item: User }) => (
        <View className="flex-row items-center py-3 px-5">
            {item.avatarUrl ? (
                <Image
                    source={{ uri: item.avatarUrl }}
                    className="w-10 h-10 rounded-full"
                />
            ) : (
                <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
                    <Text className="text-white font-bold text-sm">
                        {item.username?.[0]?.toUpperCase()}
                    </Text>
                </View>
            )}
            <Text className="ml-3 text-base font-[Poppins-Medium]">
                {item.username}
                {/* {item.userId === currentUserId ? "You" : item.username} */}
                {/* {item.userId === currentUserId && " (You)"} */}
            </Text>
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 bg-black/50 justify-end">
                <TouchableWithoutFeedback onPress={onClose}>
                    <View className="flex-1" />
                </TouchableWithoutFeedback>

                <View className="bg-white rounded-t-3xl max-h-[80%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
                        <Text className="text-xl font-[Poppins-Bold]">Liked by</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={26} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Danh sách */}
                    <FlatList
                        data={users}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.userId}
                        showsVerticalScrollIndicator={false}
                    />

                    {users.length === 0 && (
                        <View className="p-10 items-center">
                            <Text className="text-gray-500 text-base font-[Poppins-Regular]">No likes yet</Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}