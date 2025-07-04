helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
######################################################################################
helm install [RELEASE_NAME] prometheus-community/prometheus -n [NAMESPACE]
helm install prometheus-stack-release prometheus-community/prometheus -n devops-tools
######################################################################################
helm install prometheus-stack-release .\prometheus-chart\ -n devops-tools

kubectl port-forward svc/prometheus-stack-release-server -n devops-tools 9090:80
kubectl port-forward svc/prometheus-stack-release-alertmanager -n devops-tools 9093:9093



If you want Prometheus to be accessible outside the cluster, define an Ingress, or change the Service type to `NodePort` or `LoadBalancer`.


---

## ✅ **Core Components Running**


| Component                                       | Type        | Purpose                               | Status     |
| ----------------------------------------------- | ----------- | ------------------------------------- | ---------- |
| **prometheus-stack-release-server**             | Deployment  | Core Prometheus server                | ✔️ Running |
| **prometheus-stack-release-alertmanager**       | StatefulSet | Handles firing/management of alerts   | ✔️ Running |
| **prometheus-stack-release-pushgateway**        | Deployment  | Accepts metrics from short-lived jobs | ✔️ Running |
| **prometheus-stack-release-kube-state-metrics** | Deployment  | Exposes Kubernetes resource metrics   | ✔️ Running |
| **prometheus-stack-release-node-exporter**      | DaemonSet   | Gathers node-level OS metrics         | ✔️ Running |

---

## ✅ **Exposed Services**

| Service Name                                      | Type      | Port(s) | Purpose                          |
| ------------------------------------------------- | --------- | ------- | -------------------------------- |
| prometheus-stack-release-server                   | ClusterIP | 80/TCP  | Exposes Prometheus HTTP API & UI |
| prometheus-stack-release-alertmanager             | ClusterIP | 9093    | Exposes Alertmanager API & UI    |
| prometheus-stack-release-prometheus-pushgateway   | ClusterIP | 9091    | Exposes Pushgateway              |
| prometheus-stack-release-kube-state-metrics       | ClusterIP | 8080    | Exposes KSM metrics              |
| prometheus-stack-release-prometheus-node-exporter | ClusterIP | 9100    | Exposes node metrics             |

---

## ⚙️ **Pods Overview**

| Pod Name                                              | Containers | Restarts | Age  |
| ----------------------------------------------------- | ---------- | -------- | ---- |
| prometheus-stack-release-server-XXX                   | 2/2        | 0        | 156m |
| prometheus-stack-release-alertmanager-0               | 1/1        | 0        | 156m |
| prometheus-stack-release-kube-state-metrics-XXX       | 1/1        | 0        | 156m |
| prometheus-stack-release-prometheus-node-exporter-XXX | 1/1        | 0        | 156m |
| prometheus-stack-release-prometheus-pushgateway-XXX   | 1/1        | 0        | 156m |

* Prometheus server has 2 containers: the **Prometheus app** and the **configmap-reloader**.

---

## 🔍 **Key Points to Check Next**

1. **Prometheus Dashboard Access:**

   * The Prometheus **service port is 80**, it's of type **ClusterIP** → not exposed externally by default.
   * To access the UI:

     ```bash
     kubectl port-forward svc/prometheus-stack-release-server -n devops-tools 9090:80
     ```

     Then visit: [http://localhost:9090/](http://localhost:9090/)

2. **Alertmanager Dashboard Access:**

   ```bash
   kubectl port-forward svc/prometheus-stack-release-alertmanager -n devops-tools 9093:9093
   ```

   Then visit: [http://localhost:9093/](http://localhost:9093/)

3. **Metrics Verification:**

   * On the Prometheus dashboard (`localhost:9090`), go to **Status → Targets**
   * Ensure you see:

     * **Prometheus itself**
     * **node-exporter**
     * **kube-state-metrics**
     * Any other ServiceMonitors/PodMonitors you define

4. **Configure Ingress (Optional):**
   If you want Prometheus to be accessible outside the cluster, define an Ingress, or change the Service type to `NodePort` or `LoadBalancer`.

---

## ➕ Next Suggested Steps

✔️ Add **Grafana** to visualize your metrics
✔️ Add **custom ServiceMonitors/PodMonitors** for your apps
✔️ Set up **Alertmanager routes + receivers** (Slack, Email, OpsGenie, etc.)
✔️ Enable **persistent volumes** if not already (to retain Prometheus TSDB on pod restarts)
✔️ Configure **remoteWrite** if integrating with another Prometheus or Thanos

---

Let me know if you'd like to:

* Review the scrape configs,
* Add more targets,
* Secure the Prometheus UI,
* Deploy Grafana,
* Or configure persistent storage.
