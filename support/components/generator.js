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