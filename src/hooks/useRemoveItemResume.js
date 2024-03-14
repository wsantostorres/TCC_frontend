export const useRemoveItemResume = () => {
    
    const removeItem = (index, itemList, setItemList) => {

        let newItems;
        let removedWithId = false;

        newItems = itemList.map((item, i) => {

            if(i === index && item.id){
                removedWithId = true;
                return { ...item, delete: true };
            }

            return item;
        });

        if(!removedWithId){
            newItems = newItems.filter((item, i) => i !== index);
        }

        setItemList(newItems);
    };

    
    return { removeItem }
}
    