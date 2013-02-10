function buildPatientTree(){
  require([
      "dojo/ready",
      "dojo/_base/window",

      "dojo/store/Memory",
      "dijit/tree/ObjectStoreModel",
      "dijit/Tree",
      "dijit/tree/ForestStoreModel",
      "dojo/data/ItemFileReadStore",

      "dojo/dom",
      "dijit/registry",
      "dojo/dom-construct","dojo/dom-style","dojo/json"
  ], function(ready, win,
              Memory, ObjectStoreModel,
              Tree,
              ForestStoreModel,
              ItemFileReadStore,
              dom, registry,
              domConstruct, domStyle, JSON){

    var existingTree = registry.byId('patientTreeDiv');

     if(existingTree){
       console.log("Tree exists.. proceeding to destroy it..")
       existingTree.destroyRecursive();
     }

     console.log(registry.byId("patientTreeDiv"));
     if(!dom.byId("patientTreeDiv")){
        domConstruct.create('div',
                            {id: "patientTreeDiv"},
                            "patientTreeContainer",
                            "first"
        );
        domStyle.set( dom.byId('patientTreeDiv'),{'minWidth':'200px',
                                                  'maxWidth':'300px',
                                                  'minHeight':"400px",
                                                  'overflow':"auto"
        });
    }  

     // Create store 
     var patientTreeStore = new ItemFileReadStore({url: CHOSEN_PATIENT.patientTreeUrl,
                                                   clearOnClose:true,
                                                  heirarchial:false
    });
    console.log(patientTreeStore);
     // Create the model
      var patientTreeModel = new ForestStoreModel({
          store: patientTreeStore,
          query: {type: 'application'},
          rootId: 'root',
          rootLabel:"Patient",
          childrenAttrs:["children"]
      });
     
     /*
      var patientTreeStore = new Memory({
          data: [
              { id: 'patient',
                name:'Patient',
                type:'trunk'
              },
/*
                { id: 'contact',
                  name:'Contact',
                  type:'main_branch',
                  parent: 'patient'
                },
                    { id: 'address',
                      name:'Address',
                      type:'second_branch',
                      parent: 'contact'
                    },
                    { id: 'phone',
                      name:'Phone',
                      type:'second_branch',
                      parent: 'contact'
                    },
*/
/*
                { id: 'history',
                  name:'History',
                  type:'main_branch',
                  parent: 'patient'
                },
                    { id: 'demographics',
                      name:'Demographics',
                      type:'second_branch',
                      parent: 'history'
                    },
                    { id: 'social',
                      name:'Social',
                      type:'second_branch',
                      parent: 'history'
                    },
                    { id: 'family',
                      name:'Family',
                      type:'second_branch',
                      parent: 'history'
                    },

                    { id: 'medical_history',
                      name:'Medical',
                      type:'second_branch',
                      parent: 'history'
                    },
                    { id: 'surgical_history',
                      name:'Surgical',
                      type:'second_branch',
                      parent: 'history'
                    },

                { id: 'preventives',
                  name:'Preventives',
                  type:'main_branch',
                  parent: 'patient'
                },
                    { id: 'neonatal_and_paediatric_preventives',
                      name:'Neonatal & Paediatric',
                      type:'second_branch',
                      parent: 'preventives'
                    },
                    { id: 'immunisation',
                      name:'Immunisation',
                      type:'second_branch',
                      parent: 'preventives'
                    },
                    { id: 'obstetric_preventives',
                      name:'Obstetrics',
                      type:'second_branch',
                      parent: 'preventives'
                    },
                    { id: 'gynaecology_preventives',
                      name:'Gynaecology',
                      type:'second_branch',
                      parent: 'preventives'
                    },
                    { id: 'medical_and_surgical_preventives',
                      name:'Medical & Surgical',
                      type:'second_branch',
                      parent: 'preventives'
                    },

                { id: 'medication_and_allergies',
                  name:'Medications & Allergies',
                  type:'main_branch',
                  parent: 'patient'
                },

                    { id: 'medication_list',
                      name:'Medications',
                      type:'second_branch',
                      parent: 'medication_and_allergies'
                    },
                    { id: 'allergy_list',
                      name:'Allergies',
                      type:'second_branch',
                      parent: 'medication_and_allergies'
                    },
*/
/*
                { id: 'visits',
                  name:'Visits',
                  type:'main_branch',
                  parent: 'patient'
                },
                { id: 'admissions',
                  name:'Admissions',
                  type:'main_branch',
                  parent: 'patient'
                },
                { id: 'investigations',
                  name:'Investigations',
                  type:'main_branch',
                  parent: 'patient'
                },
                { id: 'imaging',
                  name:'Imaging',
                  type:'main_branch',
                  parent: 'patient'
                },
*/
/*
                { id: 'patient_media',
                  name:'Media',
                  type:'main_branch',
                  parent: 'patient'
                },

                    { id: 'patient_documents',
                      name:'Documents',
                      type:'second_branch',
                      parent: 'patient_media'
                    },
                    { id: 'patient_images',
                      name:'Images',
                      type:'second_branch',
                      parent: 'patient_media'
                    },
                    { id: 'patient_videos',
                      name:'Videos',
                      type:'second_branch',
                      parent: s'patient_media'
                    }
*/
/*
          ],
          getChildren: function(object){
              return this.query({parent: object.id});
          }

      });

      // Create the model
      var patientTreeModel = new ObjectStoreModel({
          store: patientTreeStore,
          query: {id: 'patient'},
          labelAttr: "name"
      });
  */

      // Create the Tree.
      ready(function(){

          function setTreeIcons(item, opened){
            //console.log(item.tree.rootNode || "Not defined");
            if(item.id=='root'){
              console.log(item.id)
              console.log("Returning iconclass for tree root..")
              return 'patientIcon'
            }
            else{
              console.log(item.id)
              console.log("Returning iconclass for tree root..")
              return (opened ? "dijitFolderOpened" : "dijitFolderClosed")
            }
          }

          var patientTree = new Tree({
              model   : patientTreeModel,
              showRoot: false,
              onClick: function(item){
                        var allowed_items     = ['Visits','Admissions',"Investigations","Imaging"];
                        var centerTopTabPane  = registry.byId("centerTopTabPane");
//                         var visitPane         = registry.byId('visitHomeContentPane');
                        var admissionPane     = registry.byId('admissionHomeContentPane');

                        if (item.name == "Visits"){
                          
                          setUpVisitTab();
//                        visitPane.set('disabled',false);
//                        visitPane.set('content',"This will Hold the Visit Data");
//                        centerTopTabPane.selectChild(visitPane);
                        }

                        if (item.name == "Admissions"){
                          admissionPane.set('disabled',false);
//                           admissionPane.set('content',"This will Hold the Admission Data");
                          centerTopTabPane.selectChild(admissionPane);
                        }

              }
          },
          'patientTreeDiv');

          patientTree.getIconClass = setTreeIcons;
          console.log("Setting Tree icons complete");

         //patientTree.placeAt('patientTreeDiv')
          patientTree.startup();
         //patientTree.expandAll();
         //patientTree.collapseAll();
      });

  });
}