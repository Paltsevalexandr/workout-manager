import WorkoutsList from "./components/home/WorkoutList";
import Content from "./components/layout/Content";

export default function Home() {
    
    return (
        <Content title="Workouts Tracking">
            <section>
                <div className="section-content">
                    <WorkoutsList />
                </div>
            </section>
        </Content>
    );
}
