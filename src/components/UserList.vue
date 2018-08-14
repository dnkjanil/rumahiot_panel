<template>
  <v-layout justify-space-around wrap>
    <v-flex xs12 sm9 mt-3>
      <v-card>
        <v-card-title>
          <v-tooltip left>
            <v-btn icon @click="getUserList" slot="activator">
              <v-icon color="primary">
                refresh
              </v-icon>
            </v-btn>
            <span>Refresh User List</span>
          </v-tooltip>
          <span class="headline mb-1">Registered User</span><br>
          <v-spacer></v-spacer>
          <v-text-field
            append-icon="search"
            label="Search"
            single-line
            hide-details
            v-model="userListSearch"
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="tableHeaders"
          :items="userList.users"
          :search="userListSearch"
          item-key="user_uuid"
          :loading="userListLoading"
        >
          <!--Loading process-->
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.user_uuid }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">{{ props.item.activated }}</td>
            <td class="text-xs-left">{{ props.item.admin }}</td>
            <td class="text-xs-left">{{ timeConverter(props.item.time_created) }}</td>
            <td >
              <v-btn icon class="mx-0" @click="onUpdateUserDetail(props.item)">
                <v-icon color="blue">edit</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="pageText" slot-scope="props">
            Rows per page {{ props.pageStart }} - {{ props.pageStop }} of {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card>
      <!--Update user detail card-->
      <v-dialog v-model="updateUserDetailCard" max-width="500px" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">Update User Detail</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-text-field
                label="User UUID"
                :value="updatedUser.user_uuid"
                v-model="updatedUser.user_uuid"
                disabled
                :counter="32"
              ></v-text-field>
              <v-text-field
                label="Email Address"
                :value="updatedUser.email"
                v-model="updatedUser.email"
                disabled
                :counter="32"
              ></v-text-field>
              <v-select
                :items="booleanSelectValue"
                v-model="updatedUser.activated"
                label="Activated"
                class="input-group--focused"
                item-value="value"
                required
              ></v-select>
              <v-select
                :items="booleanSelectValue"
                v-model="updatedUser.admin"
                label="Admin"
                class="input-group--focused"
                item-value="value"
                required
              ></v-select>
              <v-btn color="primary" :disabled="!updatedUser" @click.native="updateUserDetail">Update</v-btn>
              <v-btn color="primary" dark flat @click.native="updateUserDetailCard = false">Close</v-btn>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!--Snack bar-->
      <v-snackbar
        :timeout="snackTimeOut"
        :color="snackColor"
        v-model="snackModel"
        :multi-line="true"
      >
        {{ snackMessage }}
        <v-btn dark flat @click.native="snackModel = false">Close</v-btn>
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>

<script>
  import {GET_USER_LIST_REQUEST, UPDATE_USER_DETAIL_REQUEST} from '../store/actions/sidik'

  export default {
    data () {
      return {
        booleanSelectValue: [
          { text: 'True', value: '1' },
          { text: 'False', value: '0' }
        ],
        updatedUser: {},
        snackTimeOut: 6000,
        updateUserDetailCard: false,
        userList: {},
        snackColor: '',
        snackModel: '',
        snackMessage: '',
        userListLoading: true,
        userListSearch: '',
        tableHeaders: [
          {
            text: 'User UUID',
            align: 'left',
            value: 'user_uuid'
          },
          {
            text: 'Email',
            value: 'email',
            align: 'left'
          },
          {
            text: 'Activated',
            value: 'activated',
            align: 'left'
          },
          {
            text: 'Admin',
            value: 'admin',
            align: 'left'
          },
          {
            text: 'Date Registered',
            value: 'time_created',
            align: 'left'
          },
          {
            text: 'Actions'
          }
        ]
      }
    },
    beforeMount: function () {
      // Run mounted code here
      this.getUserList()
    },
    methods: {
      onUpdateUserDetail: function (user) {
        this.updateUserDetailCard = true
        this.updatedUser = user
      },
      timeConverter: function (unixTimeStamp) {
        // Convert unix time stamp into regular date
        const date = new Date(unixTimeStamp * 1000)
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
      },
      generateSnack: function (message, color) {
        this.snackMessage = message
        this.snackColor = color
        this.snackModel = true
      },
      getUserList: async function () {
        try {
          // Get the notification log
          this.supportedBoardLoading = true
          this.$store.dispatch(GET_USER_LIST_REQUEST)
            .then((resp) => {
              this.userList = this.$store.getters.getUserList
              this.userListLoading = false
            })
        } catch (err) {
          console.error(err)
        }
      },
      updateUserDetail: async function () {
        try {
          // Get the notification log
          this.supportedBoardLoading = true
          this.$store.dispatch(UPDATE_USER_DETAIL_REQUEST, this.updatedUser)
            .then((resp) => {
              this.updateUserDetailCard = false
              this.generateSnack(resp.data.success.message, 'success')
              this.getUserList()
            })
        } catch (err) {
          this.generateSnack(err.response.data.error.message, 'error')
          console.error(err)
        }
      }
    }
  }
</script>
