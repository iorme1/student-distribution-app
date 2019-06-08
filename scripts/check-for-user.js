import { ViewBuilder } from './classroom-view-builder.js';

let user = localStorage.getItem("user");
if (user) ViewBuilder.setCurrentUser(user);
