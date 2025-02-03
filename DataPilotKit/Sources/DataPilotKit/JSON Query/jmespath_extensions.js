
function hello() {
    var a = jmespath.TYPE_STRING;
   return 69;
}

jmespath.registerFunction("hello", hello, [])

function date(dateString) {
    return new Date(dateString)
}

function dateStr(dateString) {
    return date(dateString).toLocaleDateString('en-AU')
}

function timeStr(dateString) {
    return date(dateString).toLocaleDateString('en-AU')
}

function datetimeStr(dateString) {
    return date(dateString).toLocaleString('en-AU')
}

function replaceIn(args) {
    const [inString, replaceString, withString] = args;
    return inString.replace(replaceString, withString)
}

jmespath.registerFunction("date", date, [{ types: [jmespath.TYPE_STRING] }])
jmespath.registerFunction("dateStr", dateStr, [{ types: [jmespath.TYPE_STRING] }])
jmespath.registerFunction("timeStr", timeStr, [{ types: [jmespath.TYPE_STRING] }])
jmespath.registerFunction("datetimeStr", datetimeStr, [{ types: [jmespath.TYPE_STRING] }])
jmespath.registerFunction("replaceIn", replaceIn, [{ types: [jmespath.TYPE_STRING] }, { types: [jmespath.TYPE_STRING] }, { types: [jmespath.TYPE_STRING] }])
