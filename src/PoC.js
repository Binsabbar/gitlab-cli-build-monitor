class JobsMonitorService {

}

class PipelinesMonitorService {


    getJobs(project) {
    
      return getPipelines(project)
      .then(pipelines => {
         const promises = [];
         pipelines.forEach(p => {
            promises.push(service.get(p))
         });
         
         return Promise.all(promises);
      })
    
    }
    
    getPipelines(project) {
      return client.getPipelines(project.id)
      .then(pipelines => {
       return filter(pipelines);
      });
      
    }
}

class ProjectMonitorService {

    constructor(client, pipeLineService) {
        this.client;
    }

    
    check(project){}
    
    getJobs(project) {
     return this.pipelineService.getJobs(project);
    }
}

class MonitorService {

    constructor(projects, projectMonitorService){
    this.projects = projects
    this.projectService = projectMonitorService
    }
    
    check() {
    // check all projects exist
    }
    
    start(){
      let promises = [];
      this.projects.forEach(project => {
      const jobs = this.projectService.getJobs(project);
        return Promise.all([project, jobs]);
      });
      
      return Promise.all(promises)
    }
}
