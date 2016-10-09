module powerbi.extensibility.visual {
    /**
     * Gets property value for a particular object.
     *
     * @function
     * @param {DataViewObjects} objects - Map of defined objects.
     * @param {string} objectName       - Name of desired object.
     * @param {string} propertyName     - Name of desired property.
     * @param {T} defaultValue          - Default value of desired property.
     */
    export function getValue<T>(objects: DataViewObjects, objectName: string, propertyName: string, defaultValue: T ): T {
        if(objects) {
            let object = objects[objectName];
            if(object) {
                let property: T = <T>object[propertyName];
                if(property !== undefined) {
                    return property;
                }
            }
        }
        return defaultValue;
    }

    /**
     * Gets property value for a particular object.
     *
     * @function
     * @param {DataViewObjects} objects - Map of defined objects.
     * @param {string} objectName       - Name of desired object.
     * @param {string} propertyName     - Name of desired property.
     * @param {T} defaultValue          - Default value of desired property.
     */
    export function getValueMinMax<T>(objects: DataViewObjects, objectName: string, propertyName: string, defaultValue: T, minVal: T, maxVal: T ): T {
        if(objects) {
            let object = objects[objectName];
            if(object) {
                let property: T = <T>object[propertyName];
                if(property < minVal)
                {
                    return minVal;
                }
                 if(property > maxVal)
                {
                    return maxVal;
                }
                if(property !== undefined) {
                    return property;
                }
            }
        }
        return defaultValue;
    }


     /**
     * Gets property value for a particular object.
     *
     * @function
     * @param {DataViewObjects} objects - Map of defined objects.
     * @param {string} objectName       - Name of desired object.
     * @param {string} propertyName     - Name of desired property.
     * @param {T} defaultValue          - Default value of desired property.
     */
    export function getValueNumberMinMax(objects: DataViewObjects, objectName: string, propertyName: string, defaultValue: number, minValue: number, maxValue: number ) {
        if(objects) {
            let object = objects[objectName];
            if(object) {
                let property = object[propertyName];
                if(property !== undefined) {
                    if(property > maxValue)
                    {
                        return maxValue;
                    }
                    if(property < minValue)
                    {
                        return minValue;
                    }
                    return property;
                }
            }
        }
        return defaultValue;
    }


/**
     * Gets conditional property value for a particular object of type string
     *
     * @function
     * @param {string} inVal     -  current value of parameter 
     * @param {string} contrVal   - control value
     * @param {string} contrVal2Compare     - specific string to be compared with contrVal
     * @param {boolean} logic          -  true / false "logic"
     * @param {string} outValIfCondTrue          - output value if comparison (contrVal == contrVal2Compare) comes out as "logic" 
     */
    export function ifStringReturnString(inVal: string, contrVal: string, contrVal2Compare: string, outValIfCondTrue: string, logic: boolean, applyNow:boolean)
    {
        if(applyNow && contrVal == contrVal2Compare && logic == true)
            return outValIfCondTrue;

        if(applyNow && contrVal != contrVal2Compare && logic == false)
            return outValIfCondTrue;
        
        return inVal;
    }

export function ifStringReturnStringClustersMethod(numClustersMethods:string , numOfClusters:string)
{
        if(numOfClusters!="auto")
            return "None"
        
        if(numOfClusters=="auto" && numClustersMethods=="None")
            return "fast"

        return numClustersMethods;
}

    export function inMinMax(a: number, mi: number, ma: number)
    {
        if(a<mi)
            return mi;
        if(a>ma)
            return ma;
        return a;
    }

    

    /**
     * Gets property value for a particular object in a category.
     *
     * @function
     * @param {DataViewCategoryColumn} category - List of category objects.
     * @param {number} index                    - Index of category object.
     * @param {string} objectName               - Name of desired object.
     * @param {string} propertyName             - Name of desired property.
     * @param {T} defaultValue                  - Default value of desired property.
     */
    export function getCategoricalObjectValue<T>(category: DataViewCategoryColumn, index: number, objectName: string, propertyName: string, defaultValue: T): T {
        let categoryObjects = category.objects;

        if(categoryObjects) {
            let categoryObject: DataViewObject = categoryObjects[index];
            if(categoryObject) {
                let object = categoryObject[objectName];
                if(object) {
                    let property: T = <T>object[propertyName];
                    if(property !== undefined) {
                        return property;
                    }
                }
            }
        }
        return defaultValue;
    }
}