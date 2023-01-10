import Mock from "mockjs"
import classList from "./class.json"
import team from "./team.json"
import team1 from "./team1.json"
import noClassTeamList from "./noClassTeam.json"
import noTeamPers from "./noTeamPers"

Mock.mock("/getClasses", "get", () => {
    return {
        resCode: 200,
        resMsg: "获取成功",
        resData: classList
    }
})

Mock.mock("/getNoClassTeamList", "get", () => {
    return {
        resCode: 200,
        resMsg: "获取成功",
        resData: noClassTeamList
    }
})

Mock.mock("/getNoTeamPers", "get", () => {
    return {
        resCode: 200,
        resMsg: "获取成功",
        resData: noTeamPers
    }
})

Mock.mock("/getTeames", "post", options => {
    const body = JSON.parse(options.body)
    const classCode = body.classCode
    if (classCode === "000") {
        return {
            resCode: 200,
            resMsg: "成功",
            resData: team
        }
    }
    if (classCode === "111") {
        return {
            resCode: 200,
            resMsg: "成功",
            resData: team1
        }
    } else {
        return {
            resCode: 404,
            resMsg: "未查询到相关信息"
        }
    }
})
