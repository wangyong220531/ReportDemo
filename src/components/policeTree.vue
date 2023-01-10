<template>
    <div class="tree">
        <el-tree show-checkbox :data="policeData" node-key="userNo" ref="policeTree">
            <div class="tree-node" slot-scope="{ data }">
                <div class="icon" v-if="!data.children">
                    <img v-if="data.userType === 'CIVILPOLICE'" src="@/assets/mainPolice.png" alt="" />
                    <img v-else src="@/assets/auxPolice.png" alt="" />
                </div>
                <div class="name" v-if="data.children">{{ data.label }}</div>
                <div class="name" v-if="!data.children">{{ data.userName }}</div>
            </div>
        </el-tree>
    </div>
</template>

<script>
export default {
    name: "PoliceTree",
    props: ["policeData"],
    data() {
        return {}
    },
    computed: {
        checkedList() {
            return this.$refs.policeTree.getCheckedNodes()
        }
    },
    methods: {
        clearChecked() {
            this.$refs.policeTree.setCheckedKeys([])
        },
        setCheckedList(policeCheckedKeys) {
            this.$refs.policeTree.setCheckedKeys(policeCheckedKeys)
        }
    }
}
</script>

<style lang="scss">
.tree {
    overflow-y: scroll;
    max-height: 200px;
}
.tree-node {
    display: flex;
    align-items: center;
    .icon {
        margin-right: 10px;

        img {
            width: 14px;
            margin-top: 2px;
        }
    }
    .name {
        font-size: 12px;
        margin-top: 2px;
    }
}
</style>
