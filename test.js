// Convention 1
var UsersCollection = Refrax.createCollection("users", Refrax.Store("user"));
var ProjectsCollection = Refrax.createCollection("projects", Refrax.Store("project"));
Refrax.Schema.addLeaf(UsersCollection);
Refrax.Schema.addLeaf(ProjectsCollection);
Refrax.Schema.projects.project.addLeaf(UsersCollection);

// Convention 2
var UsersCollection = Refrax.createCollection("users", Refrax.Store("user"));
var ProjectsCollection = Refrax.createCollection("projects", Refrax.Store("project"));
Refrax.Schema.addLeaf("users", UsersCollection);
Refrax.Schema.addLeaf("projects", ProjectsCollection);
Refrax.Schema.projects.project.addLeaf("users", UsersCollection);

// Convention 3
Refrax.Schema.addLeaf("users", Refrax.createCollection("users", Refrax.Store("user")));
Refrax.Schema.addLeaf("projects", Refrax.createCollection("projects", Refrax.Store("project")));
Refrax.Schema.projects.project.addLeaf("users", Refrax.Schema.users);


Todo = React.createClass({
  componentWillMount: function() {
    this.todos = this.attach(Refrax.Schema.todos);

    // the above is syntactic sugar for something like this below

    var self = this;
    this.todos = Refrax.Agent.from(Refrax.Schema.todos);
    this.todos.subscribe('change', function() {
      RefraxTools.nextTick(function() {
        self.forceUpdate();
      });
    })
  },
  render: function() {

  }
})

Todos = React.createClass({
  componentWillMount: function() {
    this.todos = Refrax.Schema.todos.attach(this)
  },
  render: function() {
    var items = [];

    for (var i=0; i<this.todos.data.length; i++) {
      items.push(
        <Todo key={i}
              todo={this.todos.data[i]} />
      );
    }

    <ul>
      { items }
    </ul>
  }
})



// Desired virtual representation of any convention
Refrax.Schema => {
  /users
  /users/:userId
  /projects
  /projects/:projectId
  /projects/:projectId/users
  /projects/:projectId/users/:userId
}

var createUser = Refrax.createAction(function(mutator) {
  var projectId = mutator.addToProjectID;
  delete mutator.addToProjectID;

  return Refrax.createPromise(function(resolve, reject) {
      Refrax.Schema.users
        .create(mutator)
        .then(function() {
          if (projectId) {
            Refrax.Schema.projects.project({projectId: projectId})
              .update({
                project: projectId
              })
              .then(function() {
                resolve();
              }, reject);
          }
        }, reject);
    });
});

// Desired - Convention 1
var SomeView = React.createClass({
  componentWillMount: {
    this.createUser = createUser.attach(this);
  },
  render: function() {
    ...
    <Field name="name"
           value={this.createUser.data.name}
           onChange={this.createUser.setter("name")} />
    ...
  },
  _submit: function() {
    this
      .createUser()
      .then(function() {
        redirect("/foo");
      });
  }
})

// Optional - Convention 2
var SomeView = React.createClass({
  getInitialState: function() {
    return {value: 'Hello!'};
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  render: function() {
    ...
    <Field name="name"
           value={this.state.value}
           onChange={this.handleChange} />
    ...
  },
  _submit: function() {
    createUser(this.state)
      .then(function() {
        redirect("/foo");
      }, function(errors) {
        ...
      });
  }
})




var TimescardsStore = RPS.createStore("user");

var UsersDataset = UsersStore.createDataset({
  uri: "/projects"
})

UsersDataset.addDataset("user", {

})
var ProjectsStore = RPS.createStore("project")
  , UsersStore = RPS.createStore("user");

var ProjectsData = ProjectsStore.createDataset({
  uri: "/projects"
});

ProjectsData.addDataset("project", {
  uri: "/:projectId",
  paramId: "projectId"
});





var Projects = RPS.createStore("projects", {
  uri: "/projects"
});

Projects.addDataset("project", {
  uri: "/:projectId",
  paramId: "projectId"
});



// this.createUser = Datasets.users.

new MutableResource(
    Refrax.Schema.api.projects.project.crew.timecards.timecard,
    new Refrax.Parameters({
      timecardId: 1
    })
  )
  .update({city: 123})
