<template>
    <div class="container">
        <el-card shadow="hover">
            <el-button type="primary" size="mini" @click="addNewTeam">新增班组</el-button>
            <el-button type="success" size="mini" @click="submit">提交</el-button>
            <el-tabs v-model="activedClass" @tab-click="classClicked">
                <el-tab-pane v-for="classItem in classes" :key="classItem.classCode">
                    <span slot="label">
                        <div>{{ classItem.startTime }}</div>
                        <div>{{ classItem.endTime }}</div>
                    </span>
                </el-tab-pane>
            </el-tabs>
            <el-collapse>
                <div class="empty-tip-container" v-show="notFindTeamlist">
                    <img src="@/assets/notFound.png" alt="" class="notFound-image" />
                    <div class="message">未查询到相应班组</div>
                </div>
                <el-collapse-item v-for="(team, index) in teamList" :key="team.teamName">
                    <div slot="title" class="title-slot">
                        <div class="title">班组：</div>
                        <div class="team-code">{{ team.teamCode }}</div>
                        <el-popconfirm title="确定删除吗？" @confirm="deleteThisCollapseItem(index)">
                            <img slot="reference" class="delete-this-item" src="@/assets/delete.png" alt="" @click.stop />
                        </el-popconfirm>
                    </div>
                    <div class="personnel-container-header">
                        <div class="personnel-title">出警人员：</div>
                        <img src="@/assets/menu.png" alt="" width="14px" @click="() => openPersonnelDialog(index)" />
                    </div>
                    <el-dialog :visible.sync="policeDialogVisible" :modal-append-to-body="false">
                        <PoliceTree :policeData="policeData" :ref="`policeTree${index}`" />
                        <el-footer slot="footer">
                            <el-button size="mini" @click="policeSelectedCancle(index)">取消</el-button>
                            <el-button type="primary" size="mini" @click="() => policeSelectedConfirm(index)">确定</el-button>
                        </el-footer>
                    </el-dialog>
                    <div class="selected-personnel-container">
                        <template v-if="arr">
                            <el-tag v-for="police in selectedPolice[index]" :key="police.userNo" size="small" closable :disable-transitions="false" @close="() => deleteThisPoliceTag(index, police)">
                                {{ police.userName }}
                            </el-tag>
                        </template>
                    </div>
                </el-collapse-item>
                <el-collapse-item v-for="(team, index) in newAddedTeamList" :key="team.teamName">
                    <div slot="title" class="title-slot">
                        <div class="title">班组：</div>
                        <div class="team-code">
                            {{ selectedTeamTitle[index] || inputedTeamTitle[index] }}
                        </div>
                        <el-popconfirm title="确定删除吗？" @confirm="() => deleteThisCollapseItemOfNewAdded(index)">
                            <img slot="reference" class="delete-this-item" src="@/assets/delete.png" alt="" @click.stop />
                        </el-popconfirm>
                    </div>
                    <div class="team-container">
                        <el-tabs v-model="selectedTeam" @tab-click="tabClicked(index, $event)">
                            <el-tab-pane>
                                <div slot="label" class="team-type">默认班组</div>
                                <el-select v-model="selectedTeamTitle[index]" size="mini" placeholder="请选择班组" @change="selectedTeamChanged(index, $event)">
                                    <el-option v-for="team in noClassTeamList" :key="team.teamCode" :value="team.teamCode">
                                        {{ team.teamCode }}
                                    </el-option>
                                </el-select>
                            </el-tab-pane>
                            <el-tab-pane>
                                <div slot="label" class="team-type">临时班组</div>
                                <el-input v-model="inputedTeamTitle[index]" size="mini" placeholder="请输入班组" @input="teamInputed(index, $event)"></el-input>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-card>
    </div>
</template>

<script>
import { nanoid } from "nanoid"
import PoliceTree from "../src/components/policeTree.vue"

export default {
    name: "App",
    data() {
        return {
            classes: [],
            activedClass: "-1",
            teamList: [],
            noClassTeamList: [],
            notFindTeamlist: false,
            newAddedTeamList: [],
            changeSubmit: {
                reportNo: "",
                reportTeam: []
            },
            selectedTeam: "",
            selectedTeamTitle: [],
            inputedTeamTitle: [],
            policeDialogVisible: false,
            policeData: [
                { type: "CIVILPOLICE", label: "民警", children: [] },
                { type: "AUXILIARYPOLICE", label: "辅警", children: [] }
            ],
            selectedPolice: [],
            noTeamPers: [],
            arr: []
        }
    },
    components: {
        PoliceTree
    },
    created() {
        this.$axios.get("/getClasses").then(res => {
            this.classes = res.data.resData.classList
        })
        this.$axios.get("/getNoClassTeamList").then(res => {
            if (res.data.resCode === 200) {
                this.noClassTeamList = res.data.resData.noClassTeamList
            }
        })
    },
    watch: {
        activedClass() {
            this.newAddedTeamList = []
            this.selectedTeamTitle = []
            this.inputedTeamTitle = []
        }
    },
    methods: {
        classClicked() {
            this.$axios.post("/getTeames", { classCode: this.classes[this.activedClass].classCode }).then(res => {
                if (res.data.resCode === 200) {
                    this.notFindTeamlist = false
                    this.teamList = res.data.resData.teamList
                    this.changeSubmit.reportNo = res.data.resData.reportNo
                    this.changeSubmit.reportTeam = JSON.parse(JSON.stringify(res.data.resData.teamList))
                } else {
                    this.notFindTeamlist = true
                    this.teamList = []
                }
            })
            this.$axios.get("/getNoTeamPers").then(res => {
                if (res.data.resCode === 200) {
                    this.noTeamPers = res.data.resData.noTeamPers
                }
            })
        },
        deleteThisCollapseItem(index) {
            this.teamList.splice(index, 1)
        },
        addNewTeam() {
            const obj = { teamCode: "", teamName: nanoid() }
            this.newAddedTeamList.push(obj)
            this.notFindTeamlist = false
        },
        tabClicked(index, $event) {
            if ($event.index === "1") {
                this.selectedTeamTitle[index] = ""
                return
            }
            if ($event.index === "0") {
                this.inputedTeamTitle[index] = ""
                return
            }
        },
        selectedTeamChanged(index, $event) {
            this.selectedTeamTitle[index] = $event
            this.newAddedTeamList[index].teamCode = $event
        },
        teamInputed(index, $event) {
            this.inputedTeamTitle[index] = $event
            this.newAddedTeamList[index].teamCode = $event
        },
        openPersonnelDialog(index) {
            this.policeDialogVisible = true
            const noTeamMainPolice = this.noTeamPers.filter(item => item.userType === "mainPolice")
            const noTeamSupPolice = this.noTeamPers.filter(item => item.userType === "supPolice")
            const x = this.teamList[index].teamPers.filter(item => item.userType === "mainPolice")
            const y = this.teamList[index].teamPers.filter(item => item.userType === "supPolice")
            this.policeData[0].children = [...noTeamMainPolice, ...x]
            this.policeData[1].children = [...noTeamSupPolice, ...y]
        },
        policeSelectedConfirm(index) {
            this.policeDialogVisible = false
            this.selectedPolice[index] = this.$refs[`policeTree${index}`][0].checkedList.filter(item => !item.children)
        },
        deleteThisPoliceTag(index, police) {
            this.selectedPolice[index].splice(this.selectedPolice[index].indexOf(police), 1)
            this.arr = this.selectedPolice[index]
            this.$nextTick(() => {
                this.$refs[`policeTree${index}`][0].setCheckedList(this.selectedPolice[index].map(item => item.userNo))
            })
        },
        submit() {
            this.newAddedTeamList = this.newAddedTeamList.map(item => {
                delete item.teamName
                return item
            })
            const arr = [...this.teamList, ...this.newAddedTeamList]
            this.changeSubmit.reportTeam = JSON.parse(JSON.stringify(arr))
        }
    }
}
</script>

<style lang="less" scoped>
.container {
    position: relative;
    .el-card {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%);
        /deep/ .el-tabs__nav {
            padding-bottom: 10px;
        }
        /deep/ .el-tabs__active-bar {
            height: 3px;
            background-color: #1d8eff;
        }
        /deep/ .el-tabs__nav-wrap::after {
            height: 1px;
            background-color: rgba(110, 110, 111, 0.187);
        }

        /deep/ .el-tabs__header {
            margin-left: 40px;
            margin-right: 40px;
            .el-tabs__nav-prev {
                left: -8px;
                .el-icon-arrow-left {
                    font-size: 26px;
                    transform: translateY(90%);
                }
            }
            .el-tabs__nav-next {
                right: -8px;
                .el-icon-arrow-right {
                    font-size: 26px;
                    transform: translateY(90%);
                }
            }
        }

        .el-collapse {
            display: flex;
            flex-direction: column;
            position: relative;
            .empty-tip-container {
                position: absolute;
                left: 50%;
                margin-top: 50%;
                transform: translate(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .notFound-image {
                    width: 100px;
                }
                .message {
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.566);
                }
            }
            .title-slot {
                display: flex;
                width: 100%;
                padding-left: 10px;
                padding-right: 10px;
                position: relative;
                .title {
                    font-size: 14px;
                    font-weight: bold;
                }
                .delete-this-item {
                    position: absolute;
                    right: 10px;
                    transform: translateY(70%);
                    width: 20px;
                    height: 20px;
                }
            }

            .team-container {
                width: 300px;
                margin-bottom: 10px;
                margin-top: -10px;
                .team-type {
                    font-size: 12px;
                }
                ::v-deep .el-tabs__active-bar {
                    height: 4px;
                    width: 48px !important;
                    background-color: #1d8eff;
                }

                ::v-deep .el-tabs__nav-wrap::after {
                    height: 3px;
                    width: 136px !important;
                    background-color: rgba(68, 68, 70, 0.187);
                }
                .el-tabs {
                    .el-tab-pane {
                        margin-left: 20px;
                        .el-select {
                            width: 70%;
                        }
                        .el-input {
                            width: 70%;
                        }
                    }
                }
            }

            .personnel-container-header {
                margin-left: 10px;
                margin-right: 10px;
                display: flex;
                justify-content: space-between;
                .personnel-title,
                .equipment-title {
                    color: #000000;
                    font-size: 12px;
                    margin-top: 10px;
                }
                img {
                    width: 12px;
                    height: 12px;
                    margin-top: 18px;
                    transform: translateY(20%);
                    margin-right: 2px;
                    cursor: pointer;
                }
            }
            .selected-personnel-container {
                height: 110px;
                width: 90%;
                border-radius: 10px;
                background-color: rgba(154, 158, 170, 0.244);
                margin-top: 6px;
                margin-left: 18px;
                overflow-y: scroll;
                padding: 10px 14px;
                .el-tag {
                    margin: 10px;
                }
            }
        }
    }
}
</style>
