import { BASE_URL } from "../../api/default";

export const HttpStatus = {
  OK: 200,
  ERROR: 400
}

export class HttpResponse {
  status = HttpStatus.ERROR;
  data = null;

  constructor(status, data) {
    this.status = status;
    this.data = data;
  }
}

const registerCourse = async (body) => {
  try {
    const url = `${BASE_URL}/courses/courses`
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: body
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      return new HttpResponse(HttpStatus.OK, data)
    }
    throw new Error("CourseAPI::registerCourse()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

const updateCourse = async (courseId, body) => {
  try {
    const url = `${BASE_URL}/courses/courses/${courseId}`;
    const options = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
      body: body,
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      return new HttpResponse(HttpStatus.OK, data);
    }
    throw new Error("CourseAPI::updateCourse()");
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
};

const registerLearning = async (body) => {
  try {
    const url = `${BASE_URL}/courses/learnings`
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      return new HttpResponse(HttpStatus.OK, data)
    }
    throw new Error("CourseAPI::registerLearning()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

const getCourse = async (id) => {
  try {
    const url = `${BASE_URL}/courses/courses/${id}`
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()

      if (data.lessons && data.lessons.length) {
        data.lessons = data.lessons.sort((lessonA, lessonB) => lessonA.id < lessonB.id ? -1 : 1);
      }

      return new HttpResponse(HttpStatus.OK, data)
    }

    throw new Error("CourseAPI::getCourse()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

const deleteCourse = async (id) => {
  try {
    const url = `${BASE_URL}/courses/courses/${id}`
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (response.ok)
      return new HttpResponse(HttpStatus.OK, null)
    throw new Error("CourseAPI::deleteCourse()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

const deleteLearning = async (id) => {
  try {
    const url = `${BASE_URL}/courses/learnings/${id}`
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (response.ok)
      return new HttpResponse(HttpStatus.OK, null)
    throw new Error("CourseAPI::deleteLearning()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

const updateLearning = async (body, learningId) => {
  try {
    const url = `${BASE_URL}/courses/learnings/${learningId}`;
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      return new HttpResponse(HttpStatus.OK, data);
    }
    throw new Error("CourseAPI::updateLearning()");
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}


export const CourseAPI = {
  registerCourse,
  registerLearning,
  getCourse,
  deleteCourse,
  deleteLearning,
  updateCourse,
  updateLearning
}