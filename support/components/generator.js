export const  generateAuthToken= (type) => {
    let res = ""

    if(type == "hardcode"){
        res = "33|0DWfzepjZqA1Utxi3X9KQ40vcmKmZdJIatAJtmnq8d0f169f"
    }

    return res
}

export const generateRules = (type) => {
    if(type == 'inventory_category'){
        return ['Skin & Body Care','Fashion','Food And Beverages','Office Tools']
    } 
}

export const generateMonthName = (idx, type) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];    
    let res = null 
    if(idx != 'all'){
        if(type == 'full'){
            res = monthNames[idx]
        } else if(type == 'short'){
            res = monthNames[idx].substring(0,3)
        }
    } else {
        if(type == 'full'){
            res = monthNames
        } else {
            res = monthNames.map(name => name.substring(0, 3));
        }
    }
    return res
}