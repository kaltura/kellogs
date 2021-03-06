import moment from 'moment';


const defaultColumnsProperties  ={
    severity: {
        width: 10,
        options: {
            "err": "red",
            "debug": "blue",
            "info": "green",
            "notice": "cyan",
            "emerg": "red",
            "alert": "red",
            "crit": "red",
            "warn": "yellow"
        }
    },
    timestamp: {
        width: 150
    },
    took: {
        width: 60
    },
    function: {
        width: 200
    },
    indent: {
        hidden: true
    },
    body: {
        width: 2000
    },
    server: {
        width: 110
    },
    session: {
        width: 75
    }
}

function char_count(str, letter)
{
    let  letter_Count = 0;
    for (let position = 0; position < str.length; position++)
    {
        if (str.charAt(position) === letter)
        {
            letter_Count += 1;
        }
    }
    return letter_Count;
}



function getLineCount(body){

    try{
        if (Array.isArray(body)) {
            return body.reduce((count, item) => {
                try {
                    if (item.text)  {
                        let lines = char_count(item.text, '\n');
                        return count + lines;
                    }
                    else {
                        return count+1;
                    }
                }catch(e)
                    {
                        console.warn("exception in item: ", item, " exception: ", e)
                        return count;
                    }
                },1 );
        } else {
            let lines = char_count(body, '\n');
            return  lines+1;
        }
    } catch(e) {
        console.warn(e);
        return 1;
    }
}

export default  class ResultsData {

    constructor(schema) {

        this.items=[];
        this.cb=null;
        this.histogram =  {
            times: [],
            values: {},
            indexes: []
        }
        this.completed=false;

        this.setSchema(schema);

        let lastItemCount=0;
        let lastCompleted=false;

        const intervalId = setInterval( ()=> {
            if (lastItemCount!==this.items.length || lastCompleted!==this.completed) {
                lastItemCount=this.items.length;
                lastCompleted=this.completed;
                console.warn("added items ",lastItemCount, " ",this.completed);
                if (this.cb) {
                    this.cb(this.completed);
                }
                if (this.completed) {
                    clearInterval(intervalId);
                }
            }
        }, 100)
    }


    setSchema(schema) {

        this.schema=schema;
        //this.schema.heatmap= { key: "severity"};

        let index = this.schema.columns.findIndex( column=>  {
            return column.name==="body";
        });


        this.schema.columns.splice(Math.max(0,index), 0,{
            name: "commands",
            label: "Cmd",
            type: "commands",
            width: 20
        });

        this.schema.columns.forEach( column=>{
            Object.assign(column,{},defaultColumnsProperties[column.name])
        });

        this.schema.columns.forEach( column=>{
            if (column.type==="timestamp") {
                Object.assign(column,{},defaultColumnsProperties['timestamp'])
            }
         });

        let options = this.getHistrogramOptions();
        for(let option in options) {
            this.histogram.values[option]=[];
        }

        console.warn("setSchema: ",this.schema);

    }
    setCompleted() {
        this.completed=true;
    }

    get commands() {
        return this.schema.commands;
    }

    get metadata() {
        return this.schema.metadata;
    }

    getColumn(key) {
        return this.schema.columns.find( column=>  {
            return column.name===key;
        });
    }

    getHistrogramColumn() {
        if (this.schema.heatmap) {
            return this.getColumn(this.schema.heatmap.key);
        }
        return "";

    }

    getHistrogramOptions() {
        let field = this.getHistrogramColumn();
        if (field) {
            return field.options;
        }
        return {"count": "yellow"};
    }

    append(result) {

        if (this.schema.heatmap) {
            let value=this.schema.heatmap.key ? result[this.schema.heatmap.key] : "count";
            this._addToHistogram(moment(result.timestamp).startOf('minute'),value,this.items.length) ;;
        }
        if (result.body) {
            result.lines = getLineCount(result.body);
        }else {
            result.lines=1;
        }
        this.items.push(result);
    }

    _addToHistogram(key,value,index) {
        try {
            if (this.histogram.times.length===0 || this.histogram.times[this.histogram.times.length-1]<key) {
                this.histogram.times.push(key);

                for(let valueName in this.histogram.values) {
                    this.histogram.values[valueName].push(0);
                }

                this.histogram.indexes.push(index);
            }
            let arr=this.histogram.values[value];
            arr[arr.length-1]++;
        }
        catch (e) {
            console.warn("exception in _addToHistogram",value," ",e);
        }
    }
  }

