
const MainContent = () => {
    return (
        <div className="flex-1 p-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to Learnify</h2>
            <p className="text-lg text-gray-700 mb-4">Here you can manage your courses, students, instructors, and settings.</p>
            <div className="bg-white p-4 shadow-md rounded-md">
                <h3 className="text-xl font-bold mb-4">Recent Courses</h3>
                <ul>
                    <li className="py-2">Introduction to Programming</li>
                    <li className="py-2">Web Development Fundamentals</li>
                    <li className="py-2">Data Science Essentials</li>
                </ul>
            </div>
        </div>
    );
};

export default MainContent;
