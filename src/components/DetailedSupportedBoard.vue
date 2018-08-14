<template>
  <v-layout justify-space-around wrap>
    <v-flex xs12 sm9 mt-3>
      <v-card>
        <v-card-title>
          <v-tooltip left>
            <v-btn icon @click="getSupportedBoard" slot="activator">
              <v-icon color="primary">
                refresh
              </v-icon>
            </v-btn>
            <span>Refresh device data</span>
          </v-tooltip>
          <span class="headline mb-1">Supported Boards</span><br>
          <v-spacer></v-spacer>
          <v-text-field
            append-icon="search"
            label="Search"
            single-line
            hide-details
            v-model="supportedBoardSearch"
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="tableHeaders"
          :items="detailedSupportedBoard.detailed_supported_boards"
          :search="supportedBoardSearch"
          item-key="board_uuid"
          :loading="supportedBoardLoading"
        >
          <!--Loading process-->
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.board_name }}</td>
            <td class="text-xs-left">{{ props.item.chip }}</td>
            <td class="text-xs-left">{{ props.item.manufacturer }}</td>
            <td class="text-xs-left">{{ timeConverter(props.item.time_added) }}</td>
            <td >
              <v-btn icon class="mx-0" @click="onUpdateBoard(props.item)">
                <v-icon color="blue">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="removeBoardConfirmation(props.item.board_name, props.item.board_uuid)">
                <v-icon color="red">delete</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="pageText" slot-scope="props">
            Rows per page {{ props.pageStart }} - {{ props.pageStop }} of {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card>
      <!--Add new board card-->
      <v-dialog v-model="newSupportedBoardCard" max-width="1200px" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">Add New Supported Board</span>
          </v-card-title>
          <v-container grid-list-xl fluid>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <span class="subheading primary--text">JSON Reference For new supported board</span>
                <v-text-field
                  :loading="newSupportedBoardLoading"
                  textarea
                  label="New supported board data in JSON format"
                  auto-grow
                  v-model="newSupportedBoard"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="subheading primary--text">Syntax Highlighted JSON</span>
                <!-- Code Block -->
                <highlight-code lang="json">
                  {{newSupportedBoard}}
                </highlight-code>
              </v-flex>
            </v-layout>
            <v-btn color="primary" :disabled="!newSupportedBoard" @click.native="addSupportedBoard">Add new board</v-btn>
            <v-btn color="primary" dark flat @click.native="newSupportedBoardCard = false">Close</v-btn>
          </v-container>
        </v-card>
      </v-dialog>
      <!--Update board card-->
      <v-dialog v-model="updateSupportedBoardCard" max-width="1200px" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">Update Supported Board</span>
          </v-card-title>
          <v-container grid-list-xl fluid>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <span class="subheading primary--text">JSON Reference For updated board</span>
                <v-text-field
                  :loading="updateSupportedBoardLoading"
                  label="Update supported board data in JSON format"
                  auto-grow
                  v-model="updatedBoard"
                  clearable
                  textarea
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="subheading primary--text">Syntax Highlighted JSON</span>
                <!-- Code Block -->
                <highlight-code lang="json">
                  {{updatedBoard}}
                </highlight-code>
              </v-flex>
            </v-layout>
            <v-btn color="primary" :disabled="!updatedBoard" @click.native="updateSupportedBoard">Update Board</v-btn>
            <v-btn color="primary" dark flat @click.native="updateSupportedBoardCard = false">Close</v-btn>
          </v-container>
        </v-card>
      </v-dialog>
      <!--Remove board confirmation dialog-->
      <v-dialog v-model="removeBoardConfirmationDialog" max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">Remove Confirmation</span>
          </v-card-title>
          <v-card-text>
            <span>Remove board : <strong>{{removedBoard.name}}</strong> </span>
          </v-card-text>
          <v-card-actions>
            <v-btn flat large active-class color="red" @click="removeBoardConfirmationDialog = false">Cancel</v-btn>
            <v-btn @click="removeSupportedBoard(removedBoard.uuid)" large active-class class="white--text" color="red">Remove Board</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--Add new board button-->
      <v-tooltip left>
        <!--Add new board button-->
        <v-btn
          fixed
          dark
          fab
          bottom
          right
          color="teal"
          slot="activator"
          @click.native="newSupportedBoardCard = true"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <span>Add new board</span>
      </v-tooltip>
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
  import {GET_DETAILED_SUPPORTED_BOARD_REQUEST, ADD_DETAILED_SUPPORTED_BOARD_REQUEST, REMOVE_DETAILED_SUPPORTED_BOARD_REQUEST, UPDATE_DETAILED_SUPPORTED_BOARD_REQUEST} from '../store/actions/gudang'

  export default {
    data () {
      return {
        removeBoardConfirmationDialog: false,
        newSupportedBoardLoading: false,
        snackTimeOut: 6000,
        snackColor: '',
        removedBoard: {
          name: '',
          uuid: ''
        },
        updatedBoard: '',
        snackModel: '',
        snackMessage: '',
        detailedSupportedBoard: {},
        newSupportedBoard: '',
        supportedBoardSearch: '',
        newSupportedBoardCard: false,
        updateSupportedBoardCard: false,
        updateSupportedBoardLoading: false,
        supportedBoardLoading: true,
        tableHeaders: [
          {
            text: 'Board name',
            align: 'left',
            value: 'board_name'
          },
          {
            text: 'Chip',
            value: 'chip',
            align: 'left'
          },
          {
            text: 'Manufacturer',
            value: 'manufacturer',
            align: 'left'
          },
          {
            text: 'Time Added',
            value: 'time_added',
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
      this.getSupportedBoard()
    },
    methods: {
      removeBoardConfirmation: function (boardName, boardUUID) {
        this.removeBoardConfirmationDialog = true
        this.removedBoard.name = boardName
        this.removedBoard.uuid = boardUUID
      },
      onUpdateBoard: function (boardData) {
        const boardDataCopy = JSON.parse(JSON.stringify(boardData))
        // Remove unnecessary key
        delete boardDataCopy.gampang_template_uuid
        delete boardDataCopy.time_added
        this.updatedBoard = JSON.stringify(boardDataCopy, null, '\t')
        this.updateSupportedBoardCard = true
      },
      timeConverter: function (unixTimeStamp) {
        // Convert unix time stamp into regular date
        const date = new Date(unixTimeStamp * 1000)
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
      },
      removeSupportedBoard: async function (boardUUID) {
        try {
          // this.supportedBoardLoading = true
          this.$store.dispatch(REMOVE_DETAILED_SUPPORTED_BOARD_REQUEST, this.removedBoard.uuid)
            .then(resp => {
              this.removeBoardConfirmationDialog = false
              this.generateSnack(resp.data.success.message, 'success')
              this.supportedBoardLoading = false
              this.getSupportedBoard()
            })
            .catch(err => {
              this.supportedBoardLoading = false
              this.removeBoardConfirmationDialog = false
              this.generateSnack(err.response.data.error.message, 'error')
            })
        } catch (err) {
          console.error(err)
        }
      },
      updateSupportedBoard: async function () {
        try {
          // this.supportedBoardLoading = true
          this.$store.dispatch(UPDATE_DETAILED_SUPPORTED_BOARD_REQUEST, this.updatedBoard)
            .then(resp => {
              this.updateSupportedBoardCard = false
              this.generateSnack(resp.data.success.message, 'success')
              this.updateSupportedBoardLoading = false
              this.getSupportedBoard()
            })
            .catch(err => {
              this.updateSupportedBoardLoading = false
              this.updateSupportedBoardCard = false
              this.generateSnack(err.response.data.error.message, 'error')
            })
        } catch (err) {
          console.error(err)
        }
      },
      generateSnack: function (message, color) {
        this.snackMessage = message
        this.snackColor = color
        this.snackModel = true
      },
      getSupportedBoard: async function () {
        try {
          // Get the notification log
          this.supportedBoardLoading = true
          this.$store.dispatch(GET_DETAILED_SUPPORTED_BOARD_REQUEST)
            .then((resp) => {
              this.detailedSupportedBoard = this.$store.getters.getDetailedSupportedBoard
              this.supportedBoardLoading = false
            })
        } catch (err) {
          console.error(err)
        }
      },
      addSupportedBoard: async function () {
        try {
          this.newSupportedBoardLoading = true
          this.$store.dispatch(ADD_DETAILED_SUPPORTED_BOARD_REQUEST, this.newSupportedBoard)
            .then(resp => {
              this.newSupportedBoardCard = false
              this.newSupportedBoard = ''
              this.generateSnack(resp.data.success.message, 'success')
              this.newSupportedBoardLoading = false
              this.getSupportedBoard()
            })
            .catch(err => {
              this.newSupportedBoardLoading = false
              this.generateSnack(err.response.data.error.message, 'error')
            })
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
</script>
