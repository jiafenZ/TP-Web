<template>
  <div>
    <div class="dashboard-container">
      <el-card class="card">
        <h2 class="dashboard-text"> Hi, {{ realName }} ! </h2>
        <p style="color:red;">你今天有 {{ todayNo }} 个待办事项</p>
        <el-calendar v-model="value" class="data">
          <template
            slot="dateCell"
            slot-scope="{ data: data }"
          >
            <div>
              {{ data.day.split('-').slice(2).join('-') }}
              <div v-for="item in todoListTag" :key="item.todo_data">
                <div v-if="item.tag === 1" class="tag">
                  <i v-if="item.todo_data.slice(5,10) === data.day.split('-').slice(1).join('-')" class="el-icon-alarm-clock" />
                </div>
                <div v-if="item.tag === 0" class="done-tag">
                  <i v-if="item.todo_data.slice(5,10) === data.day.split('-').slice(1).join('-')" class="el-icon-alarm-clock" />
                </div>
                <!-- <i v-if="date.slice(5,10) === data.day.split('-').slice(1).join('-')" class="el-icon-alarm-clock" /> -->
              </div>
            </div>

            <el-popover
              placement="bottom"
              width="350"
              trigger="click"
            >
              <h3 style="text-align: center;">待办列表</h3>
              <el-input v-model="input" placeholder="添加待办事项" @keypress.native.enter="addByEnterKey()" />
              <el-checkbox-group
                v-model="checkedOptions"
              >
                <div>
                  <el-checkbox v-for="content in Options" :key="content" :label="content" :disabled="is_disable(content)">
                    <p class="checkbox_content"> {{ content }} </p>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
              <p slot="reference" :class="data.isSelected ? 'is-selected' : ''" class="click-border" @click="getList(data.day)" />
              <br><br>
              <el-button type="primary" size="mini" style="margin-left: 130px;" @click="submit(data.day)">保存</el-button>
            </el-popover>
          </template>
        </el-calendar>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addTodoList, getTodoList, getTodoTag } from '@/api/todo'
export default {
  name: 'Dashboard',
  data() {
    return {
      visible: false,
      value: new Date(),
      realName: localStorage.realName,
      checkedOptions: '',
      oldCheckOptions: '',
      Options: '',
      todoListTag: '',
      input: '',
      todo_id: '',
      todayNo: 0
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getTag()
    this.$nextTick(() => {
      // 点击前一个月，获取当月已设置待办事项的日期
      const prevBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(1)'
      )
      prevBtn.addEventListener('click', e => {
        const data = {
          'date': this.dateFormat(this.value)
        }
        getTodoTag(data).then((response) => {
          this.todoListTag = response.data.todoListTag
          this.todayNo = response.data.todo_len
        })
      })

      const todayBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(2)'
      )
      todayBtn.addEventListener('click', e => {
        const data = {
          'date': this.dateFormat(this.value)
        }
        getTodoTag(data).then((response) => {
          this.todoListTag = response.data.todoListTag
          this.todayNo = response.data.todo_len
        })
      })

      // 点击下一个月，获取当月已设置待办事项的日期
      const nextBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(3)'
      )
      nextBtn.addEventListener('click', () => {
        const data = {
          'date': this.dateFormat(this.value)
        }
        getTodoTag(data).then((response) => {
          this.todoListTag = response.data.todoListTag
          this.todayNo = response.data.todo_len
        })
      })
    })
  },
  methods: {
    dateFormat(time) {
      var date = new Date(time)
      var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
      * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
      * */
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      // var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      // var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      // var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      // var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return year + '-' + month
    },
    getTag() {
      const data = {
        'date': this.dateFormat(this.value)
      }
      getTodoTag(data).then((response) => {
        this.todoListTag = response.data.todoListTag
        this.todayNo = response.data.todo_len
      })
    },
    is_disable(item) {
      if (this.oldCheckOptions.includes(item)) {
        return true
      } else {
        return false
      }
    },
    addByEnterKey() {
      if (this.input.replace(/\s*/g, '') !== '') {
        this.Options.push(this.input)
        this.input = ''
      } else {
        this.input = ''
      }
    },
    getList(date) {
      // 获取当月已设置待办事项的日期
      const datas = {
        'todo_date': date
      }
      getTodoList(datas).then((response) => {
        this.Options = response.data.Options
        this.checkedOptions = response.data.checkedOptions
        this.oldCheckOptions = response.data.checkedOptions
        this.todo_id = response.data.todo_id
      })
    },
    submit(date) {
      if (this.Options.length !== 0) {
        const data = {
          'contents': {
            'Options': this.Options,
            'checkedOptions': this.checkedOptions
          },
          'todo_date': date,
          'todo_id': this.todo_id
        }
        addTodoList(data).then(() => {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        this.$notify({
          title: '警告',
          message: '请添加待办事项',
          type: 'warning',
          duration: 2000
        })
      }
    }
  }
}
</script>

<style>
.dashboard-container{
  margin: 30px;
}
.card{
  display: flex;
}
.checkbox_content {
  width: 280px;
  display: inline-grid;
  white-space: pre-line;
  word-wrap: break-word;
  }
.click-border{
  margin-top: -30px;
  height: 86px;
}
.tag{
  margin-top: -1px;
  text-align: center;
  color:red;
}
.done-tag{
  margin-top: -1px;
  text-align: center;
  color:#A9A9A9;
}
</style>
